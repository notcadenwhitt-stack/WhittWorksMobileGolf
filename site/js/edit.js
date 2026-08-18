/* Edit mode. Loaded by app.js only when the URL carries ?edit, so a normal
   visitor never downloads or runs any of this.
 *
 * Every element the build can rewrite carries data-copy="key". Here those
 * elements become editable in place; Save posts the changed keys to a
 * Netlify Function, which commits content/copy.json to the repo. The deploy
 * that follows is what puts the words on the live site.
 *
 * The password never reaches the browser's storage: it is exchanged once for
 * a short-lived signed token, and only that token is kept.
 */
(function () {
  "use strict";

  var AUTH_URL = "/.netlify/functions/edit-auth";
  var SAVE_URL = "/.netlify/functions/save-copy";
  var TOKEN_KEY = "sdg-edit-token";
  var MAX_LEN = 2000;

  var nodes = [].slice.call(document.querySelectorAll("[data-copy]"));
  if (!nodes.length) return;

  /* Load before anything is drawn: the sign-in prompt appears ahead of
     start(), and without this it renders as raw unstyled form controls. */
  var sheet = document.createElement("link");
  sheet.rel = "stylesheet";
  sheet.href = "css/edit.css";
  document.head.appendChild(sheet);

  var original = {};
  var editing = true;
  var bar, status, saveBtn, countEl;

  nodes.forEach(function (el) {
    original[el.getAttribute("data-copy")] = el.textContent.trim();
  });

  /* ---------- changes ---------- */

  function changed() {
    var out = {};
    nodes.forEach(function (el) {
      var key = el.getAttribute("data-copy");
      var now = el.textContent.replace(/\s+/g, " ").trim();
      if (now !== original[key]) out[key] = now;
    });
    return out;
  }

  function refresh() {
    var n = Object.keys(changed()).length;
    countEl.textContent = n === 0 ? "No changes" : n + (n === 1 ? " change" : " changes");
    saveBtn.disabled = n === 0;
  }

  function say(text, kind) {
    status.textContent = text || "";
    status.className = "sdg-status" + (kind ? " " + kind : "");
  }

  /* ---------- edit surface ---------- */

  function setEditing(on) {
    editing = on;
    document.documentElement.classList.toggle("sdg-edit-on", on);
    nodes.forEach(function (el) {
      if (on) {
        /* plaintext-only stops pasted markup becoming nested elements the
           build would then have to strip. Firefox before 136 ignores it, so
           the paste handler below is the backstop, not a nicety. */
        el.setAttribute("contenteditable", "plaintext-only");
        if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
      } else {
        el.removeAttribute("contenteditable");
      }
    });
  }

  function onPaste(e) {
    if (!editing || !e.target.closest("[data-copy]")) return;
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text.replace(/\s+/g, " "));
  }

  function onKeydown(e) {
    if (!editing || !e.target.closest("[data-copy]")) return;
    if (e.key === "Enter") {           /* one string per element, no line breaks */
      e.preventDefault();
      e.target.blur();
    }
    if (e.key === "Escape") {
      var key = e.target.getAttribute("data-copy");
      e.target.textContent = original[key];
      e.target.blur();
      refresh();
    }
  }

  /* Links and buttons are editable text too, so a click must not navigate
     or submit while editing. Preview mode turns this off. */
  function onClick(e) {
    if (!editing) return;
    var el = e.target.closest("[data-copy]");
    if (!el) return;
    var interactive = el.closest("a[href], button, summary, label");
    if (interactive) {
      e.preventDefault();
      e.stopPropagation();
      el.focus();
    }
  }

  /* Follows focus rather than clicks, so the notice is right whether the
     owner reached the field with the mouse or the Tab key. */
  function onFocusIn(e) {
    if (!editing) return;
    var el = e.target.closest && e.target.closest("[data-copy]");
    if (!el) return;
    if (el.getAttribute("data-copy").indexOf("site.") === 0) {
      say("This text appears on every page — editing it changes all of them.", "warn");
    } else {
      say("");
    }
  }

  /* ---------- auth ---------- */

  function token() {
    try { return sessionStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
  }

  function askPassword() {
    return new Promise(function (resolve) {
      var wrap = document.createElement("div");
      wrap.className = "sdg-modal";
      var form = document.createElement("form");
      var h = document.createElement("h2");
      h.textContent = "Sign in to edit";
      var p = document.createElement("p");
      p.textContent = "Enter the editing password for this site.";
      var err = document.createElement("p");
      err.className = "err";
      var input = document.createElement("input");
      input.type = "password";
      input.autocomplete = "current-password";
      input.setAttribute("aria-label", "Editing password");
      var row = document.createElement("div");
      row.className = "row";
      var cancel = document.createElement("button");
      cancel.type = "button"; cancel.className = "ghost"; cancel.textContent = "Cancel";
      var go = document.createElement("button");
      go.type = "submit"; go.textContent = "Sign in";
      row.appendChild(cancel); row.appendChild(go);
      form.appendChild(h); form.appendChild(p); form.appendChild(input);
      form.appendChild(err); form.appendChild(row);
      wrap.appendChild(form);
      document.body.appendChild(wrap);
      input.focus();

      cancel.addEventListener("click", function () {
        wrap.remove(); resolve(false);
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        go.disabled = true; err.textContent = "";
        fetch(AUTH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: input.value })
        })
          .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
          .then(function (res) {
            if (!res.ok || !res.j.token) throw new Error(res.j.error || "Sign-in failed");
            try { sessionStorage.setItem(TOKEN_KEY, res.j.token); } catch (e) {}
            wrap.remove(); resolve(true);
          })
          .catch(function (e) {
            err.textContent = e.message === "Failed to fetch"
              ? "Could not reach the server. Is this the deployed site?"
              : e.message;
            go.disabled = false;
            input.select();
          });
      });
    });
  }

  /* ---------- save ---------- */

  function save() {
    var changes = changed();
    var keys = Object.keys(changes);
    if (!keys.length) return;

    var tooLong = keys.filter(function (k) { return changes[k].length > MAX_LEN; });
    if (tooLong.length) {
      say("Too long: " + tooLong.length + " item(s) over " + MAX_LEN + " characters.", "err");
      return;
    }
    var empty = keys.filter(function (k) { return !changes[k]; });
    if (empty.length) {
      say("Empty text is not allowed. Press Escape on a field to restore it.", "err");
      return;
    }

    saveBtn.disabled = true;
    say("Saving…");

    fetch(SAVE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token()
      },
      body: JSON.stringify({ changes: changes })
    })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (res) {
        if (res.status === 401) {
          try { sessionStorage.removeItem(TOKEN_KEY); } catch (e) {}
          say("Session expired. Reload the page and sign in again.", "err");
          return;
        }
        if (res.status !== 200) throw new Error(res.j.error || "Save failed");
        keys.forEach(function (k) { original[k] = changes[k]; });
        refresh();
        say("Saved. The live site updates in about a minute.", "ok");
      })
      .catch(function (e) {
        say(e.message, "err");
        saveBtn.disabled = false;
      });
  }

  /* ---------- toolbar ---------- */

  function buildBar() {
    bar = document.createElement("div");
    bar.className = "sdg-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Editing toolbar");

    countEl = document.createElement("span");

    saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", save);

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "ghost";
    toggle.textContent = "Preview";
    toggle.addEventListener("click", function () {
      setEditing(!editing);
      toggle.textContent = editing ? "Preview" : "Back to editing";
      say(editing ? "" : "Preview mode — links work, nothing is editable.");
    });

    status = document.createElement("span");
    status.className = "sdg-status";

    bar.appendChild(countEl);
    bar.appendChild(saveBtn);
    bar.appendChild(toggle);
    bar.appendChild(status);
    document.body.appendChild(bar);
  }

  /* ---------- start ---------- */

  function start() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/edit.css";
    document.head.appendChild(link);

    /* The owner is not a visitor deciding about analytics, and the banner
       is fixed to the same corner as the toolbar. Take it off the screen for
       the session; declining here would also write a consent choice that has
       nothing to do with editing. */
    var banner = document.getElementById("consentBanner");
    if (banner) banner.classList.add("is-hidden");
    document.body.classList.remove("has-banner");

    buildBar();
    setEditing(true);
    refresh();

    document.addEventListener("input", refresh);
    document.addEventListener("paste", onPaste, true);
    document.addEventListener("keydown", onKeydown, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocusIn);

    window.addEventListener("beforeunload", function (e) {
      if (Object.keys(changed()).length) {
        e.preventDefault();
        e.returnValue = "";
      }
    });

    say(nodes.length + " editable items on this page.");
  }

  if (token()) {
    start();
  } else {
    askPassword().then(function (ok) {
      if (ok) start();
    });
  }
})();
