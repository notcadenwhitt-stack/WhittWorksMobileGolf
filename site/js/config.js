/* Central brand + integration config for Southern Drive Golf Co.
   Everything operational is set here so no other file needs editing at
   go-live: form endpoint, PostHog key, and the public starting price. */

window.SITE_CONFIG = {
  brandName: "Southern Drive Golf Co",
  legalEntity: "WhittWorks Studios LLC",
  serviceArea: "Alabama",

  /* Quote form processor endpoint (e.g. Formspree form URL).
     Empty = form shows a "booking opens soon" notice instead of submitting. */
  formEndpoint: "",

  /* PostHog project API key (publishable, starts with "phc_").
     Empty = analytics never loads. Loading also requires cookie consent. */
  posthogKey: "",
  posthogHost: "https://us.i.posthog.com",

  /* Shown on the site once confirmed, e.g. "750". Empty hides price mentions. */
  startingPrice: ""
};
