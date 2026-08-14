/* Southern Drive Golf Co — site behavior.
   External file by design: keeps CSP at script-src 'self'. No inline handlers. */

(function () {
  "use strict";

  /* Marks that scripting is alive. The hero nav only hides itself behind
     this class, so a visitor with JS disabled always keeps the navigation. */
  document.documentElement.classList.add("js");

  var CFG = window.SITE_CONFIG || {};
  var CONSENT_KEY = "sdg-consent"; /* "accepted" | "declined" */

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primaryNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Current-page nav marker (relative links, compare last segment) ---------- */
  var segs = location.pathname.split("/");
  var here = segs[segs.length - 1] || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
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

  /* ---------- Floating header reveal ----------
     On the pinned-video page the floating nav stays hidden (see the
     body.pinned-video rules in styles.css) while the video is on screen.
     The bottom edge of the pinned block is the line: scroll past it and
     the island fades in and locks at the top; scroll back above it and
     the island hides again.

     The threshold is clamped to the furthest the page can actually
     scroll. Without that clamp, a viewport taller than the content below
     the block puts the threshold out of reach and the navigation never
     appears at all. */
  var videoBlock = document.querySelector(".video-pin");
  var siteHeader = document.querySelector(".site-header");
  var pinnedBackdrop = document.querySelector(".video-pin-sticky");

  if (videoBlock && siteHeader) {
    var wasPast = null;
    var ticking = false;

    var update = function () {
      var blockTop = videoBlock.getBoundingClientRect().top + window.scrollY;
      var blockBottom = blockTop + videoBlock.offsetHeight;
      var maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      var threshold = Math.min(blockBottom, maxScroll);
      var past = window.scrollY >= threshold - 1;

      if (past === wasPast) return;
      wasPast = past;

      siteHeader.classList.toggle("is-revealed", past);
      if (pinnedBackdrop) pinnedBackdrop.classList.toggle("is-past", past);

      /* Stop decoding footage nobody can see; resume on the way back up */
      if (heroVideo && heroVideo.src) {
        if (past) {
          heroVideo.pause();
        } else {
          heroVideo.play().catch(function () {
            /* autoplay refused: the poster frame stands in */
          });
        }
      }
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        update();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      wasPast = null; /* geometry changed: re-evaluate from scratch */
      onScroll();
    });
    update();
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

    if (getConsent() === null) {
      showBanner();
    } else if (getConsent() === "accepted" && window.SDG_ANALYTICS) {
      window.SDG_ANALYTICS.enable();
    }
  }

  /* Footer "Cookie preferences" reopens the banner on any page */
  var prefBtn = document.getElementById("cookiePrefs");
  if (prefBtn) {
    prefBtn.addEventListener("click", function () {
      showBanner();
      var accept2 = document.getElementById("consentAccept");
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
