# Caden's Build — Final Spec

**Status: decided 2026-08-13.** This is the build sheet to shop from. Prices verified 2026-08-13; sale prices move, so re-check each line the day you order.

The three template tiers in `EQUIPMENT-TIERS.md` remain as reference. This build sits between Core and Premium: premium projector and launch monitor, with savings taken on the computer and on sun control.

---

## The build

| # | Item | Choice | Price | Where |
|---|---|---|---|---|
| 1 | Enclosure | PopCaddie inflatable ($2,998) + front shade flaps ($200). **No peak roof.** | $3,198 | [popcaddie.com](https://popcaddie.com/inflatable-enclosures/) |
| 2 | Import | Customs and duties, billed by FedEx after delivery | ~$130 | see notes |
| 3 | Launch monitor | **Bushnell Launch Pro** (Foresight GC3 hardware) | $2,999 | [PlayBetter](https://www.playbetter.com/products/bushnell-launch-pro-launch-monitor) |
| 4 | Monitor plan, year 1 | Bushnell Silver | $200 | same |
| 5 | Projector | **BenQ AK700ST** 4K laser short throw, 4,000 lm | $2,899 | [PlayBetter](https://www.playbetter.com/products/benq-ak700st-golf-simulator-projector) |
| 6 | Computer | **Already owned:** RTX 3060 Ti, Ryzen 5 5600G, 16 GB DDR4 | $0 | see notes |
| 7 | Sun control | Crown Shades 12x12 pop-up, **black**, 1 sidewall | $250 | [crown-outdoor.com](https://crown-outdoor.com/products/12x12-pop-up-canopy-with-1-sidewall) |
| 8 | Hitting mat | SIGPRO Softy Lite 4'x5' (shipping included) | $790 | [365golfdesign.com](https://365golfdesign.com/product/sigpro-softy-lite-4x5-hitting-mat/) |
| 9 | Landing turf | Landing Pad Turf 13'4" x 10' | $670 | [shopindoorgolf.com](https://shopindoorgolf.com/products/landing-pad-turf-for-commercial-golf-simulator-enclosure) |
| 10 | Power | Jackery Explorer 2000 v2, indoor-safe, 2.6–4 hrs | $899 | [jackery.com](https://www.jackery.com/products/jackery-explorer-2000-v2-portable-power-station) |
| 11 | Cabling | J-Tech wireless HDMI kit + 50 ft wired backup | $221 | [jtechdigital.com](https://www.jtechdigital.com/products/wireless-hdmi-extender-1080p-wireless-hdmi-extender-kit-200ft) |
| 12 | Surge protection | APC SurgeArrest PE625, 25 ft | $29 | [Home Depot](https://www.homedepot.com/p/306702078) |
| 13 | Bridging tarp | Already owned | $0 | — |
| 14 | Misc | Balls, tees, storage bins, box fan, gaffer tape | $200 | allowance |
| 15 | Transport case | Padded bin or hard case for the tower | ~$60 | see notes |
| | **Total** | | **$12,545** | |

**Recurring: $200/yr** (Bushnell Silver). No other required subscription.

---

## About the enclosure line

**What the $2,998 covers.** PopCaddie states the price "includes pump, impact screen, projector bracket, custom logo printing, and international shipping." Shipping is genuinely included; it arrives by FedEx Air Courier in 28 to 30 days.

**What the ~$130 is.** It is not a PopCaddie charge. The enclosure ships internationally, and their page states plainly: *"Import duties, customs fees, taxes, and tariffs are not included in the purchase price."* Those are US government import charges that **FedEx fronts at the border and then bills you after delivery**, and PopCaddie reports "most customers" see "customs-related charges averaging around $130 USD."

So: budget it, but expect it as a separate FedEx invoice arriving days after the enclosure does, not as part of your order total. It is an average, not a quote, and tariff rates move.

**Peak roof: correctly skipped.** The +$500 upgrade "adds a peaked roof structure to improve water runoff and create additional headroom." It is optional and it is not in your build. Water runoff matters most for multi-day outdoor installs in rain; for event-day work you can reschedule or move indoors. The extra headroom is nice for ball flight but the standard 10.82 ft ceiling is workable. If you later find yourself doing wet-weather outdoor events regularly, it is an add-on you can request on a future order.

## Order in this sequence

1. **Enclosure first.** 28 to 30 days via FedEx Air, and roughly $130 of customs is collected separately on delivery. Everything else arrives in days, so this sets your launch date.
2. **Launch monitor and projector next.** These are the two lines worth watching for price movement; both are currently at sale prices.
3. **Computer**, once you've run the dxdiag check below.
4. **Everything else** in the final week. Mat, turf, power, cabling, canopy are all stock items.

---

## The computer: you already own it

Your desktop is **RTX 3060 Ti, Ryzen 5 5600G, 16 GB DDR4**. Against GSPro's published tiers that is not merely adequate, it is the exact 1080p Ultra reference spec:

| GSPro target | Required | Yours |
|---|---|---|
| 1080p High | RTX 3060 / 4060, i5 or Ryzen 5, 16 GB | exceeds |
| **1080p Ultra** | **RTX 3060 Ti / 3070 / 4060 Ti, i5 or Ryzen 5, 16 GB** | **exact match** |
| 4K Ultra | RTX 3080+, i7 or Ryzen 7, 32 GB | below, and not needed |

You never need 4K Ultra, because the AK700ST upscales a 1080p render internally. **Buy no computer. That is $750 saved.**

The other two machines stay home: the MacBook M3 cannot run GSPro or E6 natively (both are Windows-first, and E6's App Store listing states M1 is unsupported), and the Yoga is almost certainly integrated graphics.

### What a desktop changes for mobile work

Three practical consequences, none of them dealbreakers:

**Power draw is higher.** Estimated total load, and therefore Jackery runtime:

| Setup | Total draw | Runtime on Jackery 2000 v2 |
|---|---|---|
| Desktop (3060 Ti) | ~810–1,200 W | 1.6–2.3 hrs |
| Laptop equivalent | ~620–950 W | 2.0–3.0 hrs |

A 2-hour Party booking on battery alone is tight with the desktop. Confirm shore power for any booking longer than two hours, or plan to run the generator. Verify the real numbers with a Kill A Watt meter once the gear arrives; the figures above are estimates.

**You need a display to operate.** Simplest answer: use the projector itself as your screen, which is what you are watching anyway. A small portable monitor (~$80–120) makes setup and troubleshooting easier before the projector is aligned, but it is optional, not required.

**It needs protecting in transit.** A tower bouncing in a truck bed is harder on components than a laptop in a bag. Budget roughly $60 for a padded bin or hard case, and check that the GPU is seated after each move.

**A quiet upside:** running the PC off the Jackery means it is effectively on a UPS. A venue power blip that would hard-reboot a desktop plugged into a wall will not touch it.

---

## Why these choices

**Bushnell Launch Pro.** Bushnell acquired Foresight Sports in 2021 and the Launch Pro ships the identical three-camera hardware as the Foresight GC3; side-by-side testing shows nearly identical numbers. That is genuine Foresight technology, the brand behind the GCQuad units in tour fitting studios, at roughly a fifth of GCQuad money. It is photometric, so it sits beside the ball, which matters because radar needs 15 ft of depth and this enclosure is 14.99 ft deep. It also carries a name that helps close corporate bookings and holds resale value if the business does not pan out.

**BenQ AK700ST at 4,000 lumens.** Enough brightness for a well-shaded daytime setup, and comfortably more than enough indoors or after sunset. Throw ratio 0.69 to 0.83 puts a roughly 12 ft image at 8.3 to 10 ft, ceiling-mounted clear of ball flight.

**A cheap computer on purpose.** Render at 1080p and let the 4K projector upscale internally. That drops the requirement from an RTX 3080-class card to an RTX 3060, about a $1,000 saving, and on a 12 ft screen viewed from 10 ft through a scrim it is invisible.

**A canopy instead of more lumens.** Blocking light at the entrance costs $250 and beats spending $1,349 on projector brightness that daylight would still overwhelm. Full reasoning in `PROJECTOR-BRIGHTNESS.md`.

---

## Alternatives considered, for the record

| Instead of | Considered | Why not |
|---|---|---|
| Bushnell Launch Pro $2,999 | Uneekor EYE MINI Lite $1,999 | Saves ~$1,000 and guests could not tell the difference. Genuinely defensible if cash is tight at launch; the Launch Pro wins on brand credibility with corporate buyers and on resale. |
| Bushnell Launch Pro $2,999 | Garmin Approach R50 $4,999 | What WeGo Golf runs. Matching your priciest competitor's hardware spend while charging a fifth of their rate is backwards. |
| Owned RTX 3060 Ti desktop | Buying a laptop, ~$750 | The desktop already meets 1080p Ultra spec. A laptop would only buy easier transport and longer battery runtime. |
| No peak roof | Peak roof, +$500 | Water runoff and headroom, neither needed for event-day work. |
| Canopy $250 | Brighter projector, +$1,349 | Lumens cannot beat daylight; light control can. |

## Sources

Full pricing research and source URLs: `docs/research/*.json`, `EQUIPMENT-TIERS.md`, `PROJECTOR-BRIGHTNESS.md`.
