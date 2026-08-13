/* Consent-gated PostHog loader.
   PostHog loads ONLY when (a) a project key is configured AND (b) the visitor
   accepted cookies. Until both hold, nothing is fetched and no cookie is set.
   Snippet pattern verified against posthog.com/docs during the build. */

(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var loaded = false;

  function loadPostHog() {
    if (loaded || !CFG.posthogKey) return;
    loaded = true;

    /* Official PostHog HTML-snippet loader (array stub + async script). */
    !(function (t, e) {
      var o, n, p, r;
      e.__SV ||
        ((window.posthog = e),
        (e._i = []),
        (e.init = function (i, s, a) {
          function g(t, e) {
            var o = e.split(".");
            2 == o.length && ((t = t[o[0]]), (e = o[1]));
            t[e] = function () {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
          }
          ((p = t.createElement("script")).type = "text/javascript"),
            (p.async = !0),
            (p.src = s.api_host + "/static/array.js"),
            (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
          var u = e;
          for (
            void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
              u.people = u.people || [],
              u.toString = function (t) {
                var e = "posthog";
                return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
              },
              u.people.toString = function () {
                return u.toString(1) + ".people (stub)";
              },
              o = "capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset".split(
                " "
              ),
              n = 0;
            n < o.length;
            n++
          )
            g(u, o[n]);
          e._i.push([i, s, a]);
        }),
        (e.__SV = 1));
    })(document, window.posthog || []);

    window.posthog.init(CFG.posthogKey, {
      api_host: CFG.posthogHost || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true
    });
  }

  window.BFG_ANALYTICS = {
    enable: function () {
      loadPostHog();
      if (window.posthog && window.posthog.opt_in_capturing && loaded) {
        try {
          window.posthog.opt_in_capturing();
        } catch (e) {
          /* stub not ready yet; init defaults to opted-in */
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
