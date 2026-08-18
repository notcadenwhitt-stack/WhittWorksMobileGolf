/* Southern Drive Golf Co — site behavior.
   External file by design: keeps CSP at script-src 'self'. No inline handlers. */

(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var CONSENT_KEY = "sdg-consent"; /* "accepted" | "declined" */

  /* ---------- Edit mode ----------
     The owner's in-place editor is a separate file fetched only when the URL
     asks for it, so a normal visitor pays nothing for it. Same origin, so
     script-src 'self' covers it with no CSP change. */
  if (/[?&]edit(=|&|$)/.test(location.search)) {
    var editor = document.createElement("script");
    editor.src = "js/edit.js";
    editor.defer = true;
    document.head.appendChild(editor);
  }

  /* ---------- Menu ----------
     The markup is <details>/<summary>, so the panel already opens and
     closes with scripting switched off, and the browser handles the
     button semantics and keyboard activation. Everything here is
     enhancement: close on Escape, on a click outside, and after a link is
     taken, none of which <details> does on its own. */
  var navMenu = document.getElementById("navMenu");

  if (navMenu) {
    var closeMenu = function (refocus) {
      if (!navMenu.open) return;
      navMenu.open = false;
      if (refocus) {
        var summary = navMenu.querySelector("summary");
        if (summary) summary.focus();
      }
    };

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu(true);
    });

    document.addEventListener("click", function (e) {
      if (navMenu.open && !navMenu.contains(e.target)) closeMenu(false);
    });

    /* A same-page anchor navigates without a reload, which would leave the
       panel hanging open over the destination. */
    navMenu.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) closeMenu(false);
    });
  }

  /* ---------- Current-page nav marker (relative links, compare last segment) ---------- */
  var segs = location.pathname.split("/");
  var here = segs[segs.length - 1] || "index.html";
  document.querySelectorAll(".nav-panel a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href === here) a.setAttribute("aria-current", "page");
  });

  /* ---------- Hero video ----------
     Two encodes: 720p (~16MB) for wide screens, 540p (~1.5MB) for phones,
     so a visitor on cell data isn't charged for footage sized for a
     desktop. Skipped entirely for reduced-motion or Save-Data visitors,
     who keep the still frame instead. */
  var heroVideo = document.querySelector(".hero-video[data-src]");
  if (heroVideo) {
    var wideEnough = window.matchMedia("(min-width: 48rem)").matches;
    var wantsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var conn = navigator.connection || {};
    var savingData = conn.saveData === true;
    var smallSrc = heroVideo.getAttribute("data-src-small");
    if (wantsMotion && !savingData) {
      heroVideo.src = wideEnough || !smallSrc
        ? heroVideo.getAttribute("data-src")
        : smallSrc;
      heroVideo.playbackRate = 0.5; /* half speed: a calmer flyover */
      heroVideo.addEventListener("loadedmetadata", function () {
        heroVideo.playbackRate = 0.5;
      });
      var tryPlay = function () {
        if (heroVideo.paused) {
          heroVideo.play().catch(function () {
            /* autoplay refused: poster/photo background stands in */
          });
        }
      };
      tryPlay();
      heroVideo.addEventListener("loadeddata", tryPlay);
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) tryPlay();
      });
    }
  }

  /* ---------- Pinned video: stop working once it is off screen ----------
     The backdrop is position: fixed, so it keeps compositing after the
     visitor has scrolled past it. Hiding it and pausing the footage saves
     that work. An observer on the pinned block reports the crossing
     directly, with no scroll handler and no geometry to keep in step. */
  var videoBlock = document.querySelector(".video-pin");
  var pinnedBackdrop = document.querySelector(".video-pin-sticky");

  if (videoBlock && window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      var onScreen = entries[0].isIntersecting;

      if (pinnedBackdrop) pinnedBackdrop.classList.toggle("is-past", !onScreen);

      if (heroVideo && heroVideo.src) {
        if (onScreen) {
          heroVideo.play().catch(function () {
            /* autoplay refused: the poster frame stands in */
          });
        } else {
          heroVideo.pause();
        }
      }
    }).observe(videoBlock);
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("footYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Cookie consent ---------- */
  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      localStorage.setItem(CONSENT_KEY + "-at", new Date().toISOString());
    } catch (e) {
      /* storage unavailable: treat as session-only decline */
    }
  }

  var banner = document.getElementById("consentBanner");

  function hideBanner() {
    if (banner) banner.classList.add("is-hidden");
    document.body.classList.remove("has-banner");
  }

  function showBanner() {
    if (banner) banner.classList.remove("is-hidden");
    document.body.classList.add("has-banner");
  }

  function applyConsent(value) {
    setConsent(value);
    hideBanner();
    if (value === "accepted" && window.SDG_ANALYTICS) {
      window.SDG_ANALYTICS.enable();
    }
    if (value === "declined" && window.SDG_ANALYTICS) {
      window.SDG_ANALYTICS.disable();
    }
  }

  if (banner) {
    var accept = document.getElementById("consentAccept");
    var decline = document.getElementById("consentDecline");
    if (accept) accept.addEventListener("click", function () { applyConsent("accepted"); });
    if (decline) decline.addEventListener("click", function () { applyConsent("declined"); });

    /* A Global Privacy Control or Do Not Track signal is already an answer.
       Asking again would be asking someone to repeat themselves. */
    if (window.SDG_SIGNAL_OPT_OUT) {
      hideBanner();
    } else if (getConsent() === null) {
      showBanner();
    } else if (getConsent() === "accepted" && window.SDG_ANALYTICS) {
      window.SDG_ANALYTICS.enable();
    }
  }

  /* Footer "Cookie preferences" reopens the banner on any page. Where the
     browser sends an opt-out signal there is nothing to choose, so the
     banner explains that instead of offering a button that would do
     nothing. */
  var prefBtn = document.getElementById("cookiePrefs");
  if (prefBtn) {
    prefBtn.addEventListener("click", function () {
      var accept2 = document.getElementById("consentAccept");
      var decline2 = document.getElementById("consentDecline");

      if (window.SDG_SIGNAL_OPT_OUT) {
        var msg = banner && banner.querySelector("p");
        if (msg) {
          msg.textContent =
            "Your browser is sending a Do Not Track or Global Privacy Control signal, so analytics is switched off and nothing is stored. No further choice is needed.";
        }
        if (accept2) accept2.classList.add("is-hidden");
        if (decline2) decline2.textContent = "Got it";
        showBanner();
        if (decline2) decline2.focus();
        return;
      }

      showBanner();
      if (accept2) accept2.focus();
    });
  }

  /* ---------- Quote form ---------- */
  var form = document.getElementById("quoteForm");
  if (form) {
    var msg = document.getElementById("formMsg");
    var submitBtn = form.querySelector('button[type="submit"]');

    /* Past dates make no sense for an event booking */
    var dateInput = document.getElementById("q-date");
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

    function setMsg(kind, text) {
      if (!msg) return;
      msg.className = "form-msg " + kind;
      msg.textContent = text;
    }

    function fieldError(input, text) {
      var err = document.getElementById(input.id + "-error");
      if (text) {
        input.setAttribute("aria-invalid", "true");
        if (err) err.textContent = text;
      } else {
        input.removeAttribute("aria-invalid");
        if (err) err.textContent = "";
      }
      return !!text;
    }

    form.setAttribute("novalidate", "novalidate");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      /* Honeypot: drop bot submissions without tipping off the bot */
      var honey = form.querySelector('[name="_honey"]');
      if (honey && honey.value) {
        if (window.console && console.debug) console.debug("honeypot tripped; submission dropped");
        return;
      }

      var name = document.getElementById("q-name");
      var email = document.getElementById("q-email");
      var date = document.getElementById("q-date");
      var type = document.getElementById("q-type");
      var city = document.getElementById("q-city");

      /* Privacy and accessibility requests are not bookings, so the event
         fields do not apply. The policies route those requests here, and
         demanding an event date for a deletion request would be absurd. */
      var isNonEvent = type.value === "privacy_request";

      var bad = false;
      bad = fieldError(name, name.value.trim() ? "" : "Please enter your name.") || bad;
      bad = fieldError(
        email,
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
          ? ""
          : "Please enter a valid email address."
      ) || bad;
      bad = fieldError(type, type.value ? "" : "Please choose an event type.") || bad;

      if (isNonEvent) {
        fieldError(city, "");
        if (date) fieldError(date, "");
      } else {
        bad = fieldError(city, city.value.trim() ? "" : "Please enter the event city or town.") || bad;
        if (date) {
          bad = fieldError(date, date.value ? "" : "Please pick an event date (best guess is fine).") || bad;
        }
      }

      if (bad) {
        setMsg("err", "A few fields need attention. See the notes above.");
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      if (!CFG.formEndpoint) {
        setMsg(
          "info",
          "Online booking opens soon. Nothing was sent yet. Check back shortly and we'll take your event details."
        );
        return;
      }

      var data = new FormData(form);
      setMsg("info", "Sending your request…");
      if (submitBtn) submitBtn.disabled = true;

      fetch(CFG.formEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (r) {
          if (!r.ok) throw new Error("bad status " + r.status);
          form.reset();
          setMsg(
            "ok",
            "Request received. We'll reply by email within one business day to confirm details and pricing."
          );
          if (window.SDG_ANALYTICS) {
            window.SDG_ANALYTICS.capture("quote_form_submitted", {
              event_type: data.get("event_type") || "unknown"
            });
          }
        })
        .catch(function () {
          setMsg(
            "err",
            "Something went wrong sending your request. Please try again in a minute."
          );
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
