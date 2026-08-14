# Projector Brightness for Outdoor Events

Researched 2026-08-13. The short version: **you cannot out-lumen daylight.** Brightness is worth buying, but the enclosure blocking light matters more than the projector's rating, and the numbers below show why.

## The math for your enclosure

Your PopCaddie interior is 13.77 ft wide, so figure a projected image roughly 12 ft wide. At 16:9 that's 12 × 6.75 = **81 square feet**.

Image brightness in foot-lamberts = projector lumens ÷ screen area (assuming a screen gain near 1.0, typical for a woven impact screen):

| Projector | Rated lumens | Image brightness on a 12 ft screen |
|---|---|---|
| BenQ TH671ST (Value tier) | 3,000 | 37 fL |
| Optoma GT2000HDR (Core tier) | 3,500 | 43 fL |
| BenQ AK700ST (Premium tier) | 4,000 | 49 fL |
| BenQ LH860ST | 5,000 | 62 fL |

For reference, a movie theater runs about 16 fL in a dark room. So every one of these is bright by indoor standards. Indoors or after sunset, even the Value tier's 3,000 lumens is more than enough.

## Why daylight breaks it anyway

Ambient light landing on the screen raises its black level and destroys contrast. A white screen lit by ambient light glows at roughly:

**ambient screen glow (fL) ≈ lux on the screen ÷ 12.6**

| Light hitting the screen | Screen glows at | Verdict against a 4,000 lm image (49 fL) |
|---|---|---|
| 60 lux (dim room) | ~5 fL | 10:1 contrast, looks good |
| 125 lux (dim office) | ~10 fL | 5:1, watchable |
| 500 lux (bright room) | ~40 fL | ~1:1, badly washed out |
| 2,000 lux (light through fabric) | ~159 fL | image invisible |
| 20,000 lux (open shade) | ~1,590 fL | hopeless |
| 80,000 lux (direct sun) | ~6,350 fL | hopeless |

**The target: keep light at the screen under about 60 to 125 lux.** Outdoors in direct sun that means blocking 99.9% of the light. No projector on the market makes up the difference; going from 3,000 to 5,000 lumens only buys about 1.7x, while daylight is 100x to 1,000x too bright.

## What this means in practice

**Evening and night events: every tier is excellent.** Once the sun is down, outdoor is effectively indoor. This is your best-selling window.

**Daytime outdoors: it depends entirely on sealing the enclosure.** PopCaddie's own page sells the **Front Shade Flaps (+$200) as "removable shade flaps block sunlight and improve projector visibility during daytime events."** The fabric is heavy-duty PVC tarpaulin, which is fairly opaque, but PopCaddie makes no blackout claim, and the front opening is the weak point.

For daytime outdoor bookings:
- Buy the shade flaps on every tier (already budgeted in all three).
- Keep every side panel on and orient the opening away from the sun.
- Set up in building shade or under a tent when possible.
- Expect a washed image in direct sun regardless of projector.

**Daytime indoors (gyms, ballrooms, warehouses): fine at any tier**, since you can kill the lights.

## Recommendation

If daytime outdoor events will be a real part of the business, **4,000 lumens is the sensible floor**, which is the Premium tier's AK700ST. Two cheaper ways to get there:

| Projector | Lumens | Price | Notes |
|---|---|---|---|
| [BenQ AH700ST](https://golfsimulatorsdirect.com/collections/golf-simulator-projectors) | 4,000 | ~$2,299 | 1080p rather than 4K, same brightness as the AK700ST for $600 less |
| [BenQ LH860ST](https://indoorgolfoutlet.com/collections/ultra-short-throw-golf-simulator-projectors) | 5,000 | ~$2,399 | Brightest of the group, 1080p, ultra short throw (verify throw distance fits the enclosure before buying) |

Swapping the Value tier's $949.99 TH671ST for the $2,299 AH700ST adds about $1,349 and pushes that build to roughly $8,500, over its cap. The Core tier has $2,469 of headroom and can absorb the upgrade while staying under $13,000, which makes **Core the cheapest build that handles daytime outdoor events well**.

**The business answer worth considering:** rather than paying for brightness you'll rarely use, price and schedule around it. Daytime outdoor bookings can carry a "shade or indoor space required" note in the quote, and evening events can be the default recommendation. That costs nothing and solves the problem better than any projector.

## Sources

- [BenQ, golf simulator lighting](https://www.benq.com/en-us/golf-simulator-projector/knowledge/lighting.html): 3,000 lumen minimum with short throw; 4,000 to 5,000 for larger screens or brighter rooms; "no matter how bright the projector is, you still need to control the amount of light in your room."
- [Carl's Place, choosing a projector](https://www.carlofet.com/blog/choosing-a-projector-for-a-golf-simulator-setup) and [controlling ambient light](https://www.carlofet.com/blog/how-to-control-ambient-light-in-a-golf-simulator)
- [ProjectorCentral, picking a projector for a golf simulator](https://www.projectorcentral.com/Picking-a-Projector-for-a-Golf-Simulator.htm): if you project a 4:3 image from a 16:9 projector, multiply the brightness requirement by 1.33.
- [Golf Simulator Forum, outdoor projectors](https://golfsimulatorforum.com/forum/build-your-own/projectors/281552-outdoor-projectors): shade around 4,000-5,000 lux, overcast sun 40,000-50,000 lux, direct sun 80,000-90,000 lux; one operator reports 6,000 lumens is still not enough in outdoor daylight.
- [PopCaddie enclosure page](https://popcaddie.com/inflatable-enclosures/): shade flaps +$200, heavy-duty PVC tarpaulin, no blackout rating claimed.
