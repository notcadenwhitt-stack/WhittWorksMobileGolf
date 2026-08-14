# Caden's Build — Final Spec

**Status: decided 2026-08-13.** This is the build sheet to shop from. Prices verified 2026-08-13; sale prices move, so re-check each line the day you order.

The three template tiers in `EQUIPMENT-TIERS.md` remain as reference. This build sits between Core and Premium: premium projector and launch monitor, with savings taken on the computer and on sun control.

---

## The build

| # | Item | Choice | Price | Where |
|---|---|---|---|---|
| 1 | Enclosure | PopCaddie inflatable + front shade flaps | $3,198 | [popcaddie.com](https://popcaddie.com/inflatable-enclosures/) |
| 2 | Import | Customs on delivery (average) | ~$130 | collected by carrier |
| 3 | Launch monitor | **Bushnell Launch Pro** (Foresight GC3 hardware) | $2,999 | [PlayBetter](https://www.playbetter.com/products/bushnell-launch-pro-launch-monitor) |
| 4 | Monitor plan, year 1 | Bushnell Silver | $200 | same |
| 5 | Projector | **BenQ AK700ST** 4K laser short throw, 4,000 lm | $2,899 | [PlayBetter](https://www.playbetter.com/products/benq-ak700st-golf-simulator-projector) |
| 6 | Computer | Refurbished RTX 3060 laptop, **16 GB** | ~$750 | Newegg recertified, see notes |
| 7 | Sun control | Crown Shades 12x12 pop-up, **black**, 1 sidewall | $250 | [crown-outdoor.com](https://crown-outdoor.com/products/12x12-pop-up-canopy-with-1-sidewall) |
| 8 | Hitting mat | SIGPRO Softy Lite 4'x5' (shipping included) | $790 | [365golfdesign.com](https://365golfdesign.com/product/sigpro-softy-lite-4x5-hitting-mat/) |
| 9 | Landing turf | Landing Pad Turf 13'4" x 10' | $670 | [shopindoorgolf.com](https://shopindoorgolf.com/products/landing-pad-turf-for-commercial-golf-simulator-enclosure) |
| 10 | Power | Jackery Explorer 2000 v2, indoor-safe, 2.6–4 hrs | $899 | [jackery.com](https://www.jackery.com/products/jackery-explorer-2000-v2-portable-power-station) |
| 11 | Cabling | J-Tech wireless HDMI kit + 50 ft wired backup | $221 | [jtechdigital.com](https://www.jtechdigital.com/products/wireless-hdmi-extender-1080p-wireless-hdmi-extender-kit-200ft) |
| 12 | Surge protection | APC SurgeArrest PE625, 25 ft | $29 | [Home Depot](https://www.homedepot.com/p/306702078) |
| 13 | Bridging tarp | Already owned | $0 | — |
| 14 | Misc | Balls, tees, storage bins, box fan, gaffer tape | $200 | allowance |
| | **Total** | | **$13,235** | |

**Recurring: $200/yr** (Bushnell Silver). No other required subscription.

---

## Order in this sequence

1. **Enclosure first.** 28 to 30 days via FedEx Air, and roughly $130 of customs is collected separately on delivery. Everything else arrives in days, so this sets your launch date.
2. **Launch monitor and projector next.** These are the two lines worth watching for price movement; both are currently at sale prices.
3. **Computer**, once you've run the dxdiag check below.
4. **Everything else** in the final week. Mat, turf, power, cabling, canopy are all stock items.

---

## Three things that will bite you if you skip them

**Confirm the laptop has 16 GB.** Many retail RTX 4060 machines ship 8 GB, which is under GSPro's floor. Read the actual SKU spec, not the model name.

**Check the Yoga before buying anything.** Press Windows, type `dxdiag`, Enter, open the **Display** tab. If the Name field shows an RTX 4050 or better *and* the machine has 16 GB, you may not need to buy a computer at all. If it shows Intel Iris Xe or UHD Graphics, buy the refurb laptop. Most Yogas are ultrabooks with integrated graphics and soldered memory, so plan on buying.

**The MacBook M3 is not an event machine.** GSPro is Windows only. E6 Connect's own App Store listing states M1 devices are not supported. Both can be forced through CrossOver or Parallels, and that is fine for practice, but not with a paying client watching.

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
| RTX 3060 laptop ~$750 | RTX 4070+ for native 4K | Roughly $1,000 more to render at a resolution nobody in the enclosure can resolve. |
| Canopy $250 | Brighter projector, +$1,349 | Lumens cannot beat daylight; light control can. |

## Sources

Full pricing research and source URLs: `docs/research/*.json`, `EQUIPMENT-TIERS.md`, `PROJECTOR-BRIGHTNESS.md`.
