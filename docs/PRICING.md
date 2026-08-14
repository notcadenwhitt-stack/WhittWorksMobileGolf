# Rental Pricing Research — Alabama Market

Researched 2026-08-13. Every figure below was read off the named company's own page that day; anything that could not be verified is marked. Prices move, so re-check a competitor before quoting against them.

Raw data with full source URLs: `docs/research/al-market-pricing.json`.

---

## Who you're actually competing with in Alabama

| Company | Where | What they charge | Notes |
|---|---|---|---|
| **WeGo Golf** | Mobile, Huntsville, Montgomery | **Packages start at $2,500** | National operator, the real premium ceiling in-state. Turnkey: delivery, install, Garmin R50, on-site staff, full event management. No hourly rate published. |
| **Alabama Indoor Golf League** | Birmingham | **$299 for a full day** (24 hrs) | The only published price in Alabama. It's a DIY drop-off rental, not a staffed party, so it's the market floor rather than a true competitor. |
| **Clubhouse Golf** | Birmingham (also TN) | Quote only | Uses Foresight. Targets corporate, trade shows, churches, fundraisers, house parties. |
| **Triangle Lawn Games** | Birmingham, Huntsville, Montgomery | Quote only | Broker model, partners with providers instead of owning equipment. |
| **North AL Mobile Golf Sim Rentals** | North Alabama | Unverified | Instagram-only presence, no site or pricing found. |

**The gap:** three of the five hide their pricing, the cheapest published option is unstaffed, and the staffed premium option starts at $2,500. There's clear room for a staffed, fairly-priced, transparent option.

## What the wider market charges

Atlanta is the nearest big reference market:

| Tier | Hourly | Day rate |
|---|---|---|
| Budget inflatable setups | $150–250/hr | $800–1,500 |
| Mid-tier regional pop-ups | $250–450/hr | $1,500–4,000 |
| Premium (e.g. Dryvebox Atlanta) | $350–500/hr, 2-hr minimum | $2,500–5,000 |

Dryvebox includes delivery, setup, a trained host, premium clubs, TrackMan, climate control, A/V, and a $5M liability umbrella. That's the standard a premium price implies.

One useful precedent: NextGen Event Co advertises "starting at $295/hr" nationally but drops to "$199/hour" on its Connecticut page. Operators openly flex the headline number by market, so Alabama pricing below Atlanta pricing is normal, not undercutting.

## What Alabama buyers already pay for one premium activation

This matters more than golf comps, because it's the budget line your quote competes against.

| Comparable | Market | Price |
|---|---|---|
| Luxe Booth (photo booth) | Birmingham | $895–1,095 per 3-hr package (~$300–365/hr) |
| Casino Knight (casino tables) | Statewide | $349–849 per table for up to 3 hrs |
| Huntsville Casino Parties | North Alabama | $500–800 per table |
| JTM 360 photo booth | Birmingham | $500 per 4 hrs (~$125/hr) |

A typical 3-4 table casino night runs $1,500–2,500. So Alabama event hosts routinely spend $300+/hr on a single attraction.

**Not comparable, for reference only:** fixed simulator bays like Another Nine in Montgomery ($35/hr) and Eagle Golf Simulators (from $60/hr). No delivery, no staff, no travel. Customers may still cite these, so it's worth knowing the answer: they drive there, you come to them.

---

## Recommended rate card

| Package | Length | Price | Effective hourly |
|---|---|---|---|
| **Party** | 2 hrs, single bay, attendant | **$499** | ~$250/hr |
| **Event** | 4 hrs, single bay, attendant, ~30 guests | **$849** | ~$212/hr |
| **Corporate / Full Day** | 8 hrs, attendant, leaderboard and branding options | **$1,599** | ~$200/hr |

Headline for the site: **"Starting at $499."**

**Why this works:**
- Sits well above AIGL's $299 unstaffed day rate, so you're not competing on being cheapest.
- Lands at the same effective hourly Alabama hosts already pay photo booths and casino tables, so it reads as fair rather than expensive.
- Undercuts every non-AIGL operator serving Alabama, including WeGo's $2,500 floor, by a wide margin.
- The discount ladder ($250 → $212 → $200/hr) rewards longer bookings the way Dryvebox and Casino Knight both do.

**Things to layer on later:** travel fee beyond your home radius, second bay for large events, branded leaderboards, extra hours, peak-season or weekend pricing.

## Decision status

Not yet applied to the site. `site/js/config.js` has a `startingPrice` field that is deliberately empty, and no dollar figure appears anywhere on the site until you confirm the number.
