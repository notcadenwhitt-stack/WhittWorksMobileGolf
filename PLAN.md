# Plan: Alabama Mobile Golf Simulator Venture — Equipment Tiers + Booking Website

**One-line goal:** Caden has a three-tier equipment shopping list he can buy from today, a vetted business-name shortlist, and a booking-focused, ADA-compliant marketing website pushed to this repo, where none of that exists now.

Approved 2026-08-13 with one amendment: PostHog analytics added (consent-gated), replacing the original "no analytics at launch" default.

## Classification
Track: From scratch (UI-build flavor). Parked secondary asks: transport/trailer sourcing, domain purchase, hosting/deploy, business email, entity filing.

## Goal & Success Criteria
- Equipment doc: three complete build-outs under $8,000 / $13,000 / $17,000, every line item live-priced with a purchase link, generator included, no transport items.
- Name shortlist: 8+ candidates with .com availability and Alabama SoS entity-conflict status.
- Website: multi-page static site navigable by keyboard alone, zero critical /sitecheck findings, quote form validates and posts to a configurable endpoint.
- PostHog: loads only after cookie consent, captures pageviews + quote-form events, events verified reaching the dashboard.
- Code pushed to notcadenwhitt-stack/WhittWorksMobileGolf. Nothing deployed to any host.

## Current State (at planning)
- Enclosure chosen: PopCaddie inflatable, $2,998 shipped, includes electric pump, double-layer impact screen, ceiling projector bracket, 3-side logo printing; shade flaps +$200, peak roof +$500; 28–30 day lead time, ~$130 customs (verified: popcaddie.com/inflatable-enclosures/)
- PopCaddie's business: SoCal event rentals from $1,000/event; site: hero, event categories, gallery, FAQ, quote form (verified: popcaddie.com)
- Repo verified: github.com/notcadenwhitt-stack/WhittWorksMobileGolf, public, empty (verified: GitHub API 2026-08-13)
- No business name, domain, or hosting chosen (user)

## Scope (v1)
1. Name shortlist (8–12, blue-brandable, availability-checked)
2. Equipment tier document: Value / Core / Premium, each covering enclosure + shade flaps, launch monitor, projector, computer/tablet, sim software, hitting mat + turf, generator, cables/misc
3. Website: Home, Events, Gallery, FAQ, Get a Quote, About, Privacy Policy, Terms of Service, Cookie Policy, Accessibility Statement

## Out of Scope & Parked
Transport/trailer (user parked) · deployment/hosting/domain/DNS (no Netlify, per user; GitHub Pages parked until name+domain) · business email/phone · LLC/DBA filing mechanics · rental price-setting (research recommends, Caden confirms)

## Approach
Fable 5 orchestrates. Sonnet subagents: parallel research, page coding, media sourcing. Opus 5 subagents: equipment-doc review (price sanity, component compatibility) and site review (code + a11y). Static HTML/CSS/JS, no framework, scaffolded via /sitebuild so security, legal, and a11y are built in from the start. Brand-variable text (name, entity line, starting price, PostHog key, form endpoint) lives in one config spot. Executor's choice: file layout, CSS methodology, copy phrasing.

## Requirements
- R1: Each tier's line-item total under its cap with visible arithmetic; every item live-priced with a link.
- R2: Each shortlist name shows .com availability (DNS/RDAP) and AL SoS search result (curl).
- R3: The ten pages above, cross-linked in nav and footer.
- R4: Quote form: inline validation errors, honeypot, posts to one configurable endpoint, no personal email/phone in page content.
- R5: Blue-primary palette, all text/background pairs WCAG AA contrast (4.5:1 normal, 3:1 large).
- R6: WCAG 2.1 AA bar: full keyboard nav with visible focus, alt text, semantic landmarks/headings, prefers-reduced-motion, labeled form fields.
- R7: Cookie banner on first visit, consent recorded, blocks analytics until accepted; Privacy/ToS/Cookie/Accessibility pages complete, US-appropriate, templated with chosen name + entity line.
- R8: /sitecheck reports zero critical findings.
- R9: Code pushed to the verified repo; no deploy step runs.
- R10: All media free-for-commercial-use with manifest (URL, author, license).
- R11: PostHog loads only after consent, captures pageviews + quote-form submit/attempt events; Cookie Policy lists PostHog cookies; verification = capture requests succeed post-consent + events visible in the PostHog dashboard.

## Key Decisions
- Enclosure: PopCaddie inflatable + shade flaps = $3,198/tier (user + verified)
- Caps include generator, exclude transport (user)
- Booking: quote form only → notcadenwhitt@gmail.com via provider (user)
- No hosting now; repo only (user)
- Form backend: pluggable endpoint, Formspree free tier as go-live default; Caden creates the account [A4]
- Analytics: PostHog, consent-gated (user, amendment)
- Palette: blue primary (user)

## Data & State Changes
None. Static site. Form submissions live with the form provider; analytics with PostHog; consent in visitor localStorage.

## Interfaces, Integrations & Credentials
- GitHub push: keychain PAT via git credential fill; no secrets in repo or chat
- PostHog: Project API key (publishable) from Caden's account → config placeholder until provided; personal API key, if ever needed for event queries, stays in env as ${POSTHOG_PERSONAL_API_KEY}
- Form endpoint: FORM_ENDPOINT config placeholder
- AL SoS search: curl (their cert breaks WebFetch)
- Media: Pexels / Pixabay / Coverr / Unsplash, licenses per R10

## Edge Cases & Failure Handling
- Form endpoint unset → visible "booking opens soon" notice, never a dead submit
- PostHog key unset → analytics silently skipped, site fully functional
- Consent declined → no PostHog load, no cookies beyond consent record
- JS disabled → content readable, form degrades to instructions
- Tier cap unreachable at live prices → nearest-under build + "what $X more buys" note; caps never silently exceeded
- All names conflicted → widen brainstorm; never present a taken name as available

## Risks & Adaptations
- Netlify killed mid-interview → pluggable form endpoint, no host assumptions
- 28–30 day enclosure lead time + ~$130 customs → flagged in ordering notes
- Monitor/software compatibility (GSPro etc.) → explicit Opus review check per tier
- Publishing-personal-data classifier may block the final push → stage the push command for Caden to run

## Assumptions Ledger
| ID | Assumption | Basis | Blast radius | Check |
|----|-----------|-------|--------------|-------|
| A1 | ~~Repo name~~ RESOLVED: WhittWorksMobileGolf | GitHub API | — | done |
| A2 | Entity line: "operated by WhittWorks Studios LLC," brand as trade name | repo naming + LLC filing | one-line swap | Caden veto anytime |
| A3 | ~~Workspace~~ RESOLVED: cloned to Experimentation/WhittWorksMobileGolf | clone | — | done |
| A4 | Form backend Formspree-style, wired at go-live by Caden | no-accounts-until-forced | one attribute | go-live |
| A5 | Site shows "starting at $___" from research, Caden confirms | PopCaddie pattern | one line | Phase 6 |
| A6 | PostHog US cloud host (us.i.posthog.com) | US business default | config value | key handoff |
| A7 | Pexels/Pixabay/Coverr licenses permit commercial use | published licenses, confirmed per asset | replace assets | Phase 2 manifest |
| A8 | Budget tier uses monitor's bundled/free app; mid/high use paid sim platform per research | industry norm | tier reshuffle | Phase 2 + Opus review |
| A9 | Static no-framework stack | matches WhittWorks/Level Up pattern | rebuild scaffold | approved |
| A10 | Shade flaps (+$200) in every tier | user named shade | $200/tier | approved |

## Verification
- Tier totals re-summed vs caps
- Name checks: DNS/RDAP + AL SoS curl output captured in the doc
- /sitecheck zero criticals; keyboard-only walkthrough; contrast validation; browser screenshots of every page, form error state, cookie banner
- PostHog: network capture requests 200 post-consent; events visible in dashboard
- git log + API confirm push landed

## Build Phases
- [x] Phase 1: Verify ground truth — repo confirmed, cloned, workspace init, push tested
- [ ] Phase 2: Research fan-out (6 parallel Sonnet briefs: components, competitors, AL market pricing, names, media, PostHog pattern)
- [ ] Phase 3: Equipment tier doc + Opus price/compat review
- [ ] Phase 4: Name shortlist → Caden's pick (placeholder config if deferred)
- [ ] Phase 5: Scaffold site via /sitebuild (blue palette, brand config)
- [ ] Phase 6: Content build + PostHog wiring (Sonnet agents)
- [ ] Phase 7: Legal + accessibility pass
- [ ] Phase 8: Opus review + /sitecheck + PostHog event verification
- [ ] Phase 9: Push + handoff
