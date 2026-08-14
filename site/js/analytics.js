/* Consent-gated PostHog loader.
   PostHog loads ONLY when (a) a project key is configured AND (b) the visitor
   accepted cookies. Until both hold, nothing is fetched and no cookie is set.
   This is stricter than PostHog's own minimum (their docs allow loading the
   snippet pre-consent with opt_out_capturing_by_default); we gate the load
   itself because our banner promises zero third-party contact before Accept.
   Loader body is the official JS snippet from posthog.com/docs/getting-started/install
   (fetched 2026-08-13); it derives the CDN from api_host by swapping
   ".i.posthog.com" for "-assets.i.posthog.com". */

(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var loaded = false;

  function loadPostHog() {
    if (loaded || !CFG.posthogKey) return;
    loaded = true;

    /* Official PostHog snippet (verbatim loader) */
    !function (t, e) {
      var o, n, p, r;
      e.__SV || (window.posthog && window.posthog.__loaded) || (window.posthog = e, e._i = [], e.init = function (i, s, a) {
        function g(t, e) {
          var o = e.split(".");
          2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        }
        p || ((p = t.createElement("script")).type = "text/javascript", p.crossOrigin = "anonymous", p.async = !0, p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js", p.onerror = function () { p = null; }, (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r));
        var u = e;
        for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) {
          var e = "posthog";
          return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
        }, u.people.toString = function () {
          return u.toString(1) + ".people (stub)";
        }, o = "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "), n = 0; n < o.length; n++) g(u, o[n]);
        e._i.push([i, s, a]);
      }, e.__SV = 1);
    }(document, window.posthog || []);

    window.posthog.init(CFG.posthogKey, {
      api_host: CFG.posthogHost || "https://us.i.posthog.com",
      defaults: "2026-05-30",
      person_profiles: "identified_only",
      /* The Cookie Policy and Privacy Policy both state that this site does
         not record sessions. Enforce that here rather than relying on a
         project-level setting that could be toggled elsewhere. */
      disable_session_recording: true
    });
  }

  window.SDG_ANALYTICS = {
    enable: function () {
      loadPostHog();
      if (loaded && window.posthog && window.posthog.opt_in_capturing) {
        try {
          window.posthog.opt_in_capturing();
        } catch (e) {
          /* queued on the stub; init defaults cover it */
        }
      }
    },
    disable: function () {
      if (loaded && window.posthog && window.posthog.opt_out_capturing) {
        try {
          window.posthog.opt_out_capturing();
        } catch (e) {
          /* nothing loaded, nothing to disable */
        }
      }
      /* The cookie policy promises decline deletes PostHog's stored entries */
      try {
        var doomed = [];
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (key && key.indexOf("ph_") === 0) doomed.push(key);
        }
        doomed.forEach(function (k) { localStorage.removeItem(k); });
        /* PostHog sets its cookie against the registered domain, so expiring
           it only on the exact host leaves it behind on www vs apex. Expire
           it on the host and on each parent domain. */
        var hostParts = location.hostname.split(".");
        var scopes = [""];
        for (var h = 0; h < hostParts.length - 1; h++) {
          scopes.push("; domain=." + hostParts.slice(h).join("."));
        }
        document.cookie.split(";").forEach(function (c) {
          var name = c.split("=")[0].trim();
          if (name.indexOf("ph_") !== 0) return;
          scopes.forEach(function (scope) {
            document.cookie =
              name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + scope;
          });
        });
      } catch (e) {
        /* storage unavailable; nothing persisted anyway */
      }
    },
    capture: function (name, props) {
      if (loaded && window.posthog && window.posthog.capture) {
        try {
          window.posthog.capture(name, props || {});
        } catch (e) {
          /* analytics must never break the page */
        }
      }
    }
  };
})();
