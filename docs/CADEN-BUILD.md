# Caden's Build — Custom Spec

Your own configuration, distinct from the three template tiers in `EQUIPMENT-TIERS.md`. Researched 2026-08-13.

## Locked in

| Item | Choice | Price |
|---|---|---|
| Enclosure | PopCaddie inflatable + front shade flaps | $3,198 (+ ~$130 customs) |
| Sun control | Crown Shades 12x12 pop-up, black, 1 sidewall | $250 |
| Projector | **BenQ AK700ST** 4K laser short throw, 4,000 ANSI lumens | $2,899 |
| Bridging tarp | Already owned | $0 |

Running total: **$6,477**

## The computer question

### Your MacBook M3 will not do it reliably

Neither major sim platform supports Apple Silicon natively:

- **GSPro** is Windows only. It runs on Apple Silicon through CrossOver or Parallels, and people do report success, but it is a compatibility layer, not a supported configuration.
- **E6 Connect** lists Windows and iOS. Its own App Store listing states **M1 devices are not supported**. The macOS route is Parallels running Windows, again a workaround.

For personal practice, a workaround is fine. For a business where 30 guests are standing around at a paid event, a translation layer sitting between your launch monitor and your projector is the wrong place to save $800. When it breaks, it breaks in front of a paying client.

**Verdict: keep the MacBook for quotes, invoices, and the site. Buy a dedicated Windows machine for events.**

### The Lenovo Yoga (i7, ~8 GB) — right OS, probably wrong graphics

Windows is the correct platform, so this machine is a better starting point than the MacBook. Two things decide it, and only one is fixable.

**The i7 is not the problem.** GSPro is GPU-bound; the processor matters far less than the graphics card.

**Graphics is the problem.** Most Yogas are ultrabooks running Intel Iris Xe integrated graphics, which sits far below the RTX 3060 floor. A few Yoga Pro and Yoga Slim configurations ship a discrete RTX 4050 or 4060, and those would work. You cannot tell from the name.

**8 GB is under the 16 GB floor**, and on most Yoga models the RAM is soldered to the board, meaning it cannot be upgraded.

**Check it in 30 seconds:** press Windows, type `dxdiag`, hit Enter, open the **Display** tab. The Name field is your graphics chip.

| What dxdiag shows | Verdict |
|---|---|
| RTX 4050 / 4060 or better | Usable. Confirm RAM is 16 GB; if it's 8 GB, check whether this model's memory is replaceable. |
| Intel Iris Xe, UHD Graphics, or similar | Won't run GSPro at event quality. Could still handle a launch monitor's own bundled app (see below). |

**The escape hatch:** GSPro is the demanding one. Lighter platforms, including E6 Connect at modest settings and the simple apps bundled with monitors like SkyTrak and Voice Caddie, ask far less of a machine. If you choose a monitor with capable bundled software and skip GSPro, integrated graphics becomes plausible. That decision belongs with the launch monitor choice, not the computer.

### The insight that saves real money

The AK700ST is a 4K projector, but **you do not need a 4K-capable GPU**. Render the sim at 1080p and let the projector upscale internally. Confirmed by [Home Performance Lab](https://homeperformancelab.com/gspro-system-requirements/): "Setting GSPro to 1080p on a 4K projector still only requires 1080p GPU rendering, as the projector handles the upscaling internally."

That drops the requirement from an RTX 3080-class card (4K Ultra) to an RTX 3060-class card, roughly a $1,000 difference. On a 12 ft impact screen viewed from 10 ft away, in a scrimmed enclosure, nobody at your event will identify the render resolution.

### GSPro requirements by target

| Target | GPU | CPU | RAM |
|---|---|---|---|
| 1080p High | RTX 3060, RTX 4060, RX 6600 | i5 / Ryzen 5 | 16 GB |
| 1080p Ultra | RTX 3060 Ti, RTX 4060 Ti, RTX 3070 | i5 / Ryzen 5 | 16 GB |
| 4K Ultra | RTX 3080, RTX 4070+ | i7 / Ryzen 7 | 32 GB |

GSPro is built on Unity and is overwhelmingly GPU-bound, so the CPU matters far less than the graphics card. **Your floor is an RTX 3060 with 16 GB of RAM.**

### Cheapest paths, in order

| Option | Rough price | Notes |
|---|---|---|
| **Refurbished RTX 3060 gaming laptop, 16 GB** | ~$600–850 | The value pick. ASUS TUF Dash 15 and MSI Stealth 15M configs show up recertified on Newegg. Built-in screen doubles as your operator display, and the battery rides out a generator hiccup. |
| Refurbished RTX 3060 Ti / 4060 laptop | ~$850–1,000 | Headroom for 1080p Ultra and future software. |
| Mini PC with RTX 4060 | ~$899 | Smaller and tougher in a bin, but needs a separate monitor to operate. |
| New RTX 4060 laptop, 16 GB | ~$999 | Warranty and no used-market risk. |

**Watch the RAM.** Plenty of retail RTX 4060 laptops ship with 8 GB, which is under the floor. Confirm 16 GB on the actual SKU before paying.

**Storage:** 1 TB NVMe minimum. GSPro itself is small, but course libraries grow fast.

### Recommendation

A **refurbished RTX 3060 laptop with 16 GB at $600–850.** It clears 1080p High comfortably, the projector handles the rest, and if it dies on a Saturday you replace it without pain. Spending more only pays off if you later want 1080p Ultra or a second bay.

## Launch monitor: what the industry actually runs

### The tiers, by what commercial operators use

| Unit | Price | Where it sits |
|---|---|---|
| TrackMan | $18,000–30,000+/bay | Tour fitting, premium venues. Dryvebox (Atlanta) runs TrackMan. |
| Foresight GCQuad | $15,000–24,000/bay | Commercial fixed installs, fitting studios. |
| **Foresight GC3 / Bushnell Launch Pro** | **~$2,999** | The commercial entry point. Same three-camera hardware in both. |
| Garmin Approach R50 | $4,999 | **What WeGo Golf runs**, the operator serving Mobile, Huntsville and Montgomery. |
| Uneekor EYE MINI Lite | $1,999 (sale, list $2,750) | Prosumer to light commercial. |
| SkyTrak ST MAX | $1,995 (sale, list $2,995) | Prosumer. |

**The key fact:** Bushnell acquired Foresight Sports in 2021, and the Bushnell Launch Pro ships **the identical three-camera hardware as the Foresight GC3**. Side-by-side testing shows the numbers are nearly identical on every shot. You are buying genuine Foresight hardware, the brand behind the GCQuad units in tour fitting studios, at roughly a fifth of GCQuad money.

### Why photometric matters for your enclosure

Camera-based units sit beside the ball. Radar units need 5 ft behind the golfer plus 10 ft to the screen, which is 15 ft in an enclosure that is 14.99 ft deep. Choosing photometric removes that constraint entirely and is the single biggest reason not to buy down here.

### Watch the subscription

The $2,999 is hardware only. Bushnell gates data and simulation behind plans:

| Plan | Cost | What it unlocks |
|---|---|---|
| Silver | $199.99/yr | Ball and club data, 5 courses, Pinseeker, FSX Pro |
| Gold | $499/yr | Ball and club data, 25 courses, full FSX Play simulation |
| GSPro add-on | +$250/yr | Requires active Gold |

Realistic year one: **$3,199 with Silver**, or **$3,499 with Gold**. Compare with Uneekor EYE MINI Lite at $1,999 + $199/yr Pro = **$2,198**, or SkyTrak ST MAX at $1,995 + $199.99 = **$2,195**.

### Recommendation: Bushnell Launch Pro

Roughly $1,000 more in year one than the alternatives, and worth it here for three reasons that are specific to a rental business rather than to spec sheets:

1. **It closes corporate bookings.** "We run Foresight camera technology, the same system used in tour fitting" is a real sales line when you are asking a company for $1,599. Uneekor and SkyTrak do not carry that recognition with a buyer who is not a golf nerd.
2. **It holds value.** Foresight hardware has a resale floor. If the business does not work, you recover far more of this than of a prosumer unit.
3. **It out-specs your in-state competition's price point.** WeGo Golf charges from $2,500 an event running a $4,999 Garmin R50. You would be running comparable-tier camera hardware at a $499 entry price.

**The honest counter-argument:** your guests cannot tell the difference. Nobody at a wedding reception knows whether their carry number is accurate to 1 yard or 3. If cash is tight at launch, the **Uneekor EYE MINI Lite at $1,999** is genuinely fine equipment, saves you about $1,000, and you can upgrade once bookings are steady. That is a defensible business decision, not a compromise on the guest experience.

**What I would not do:** buy the Garmin R50 at $4,999. It is excellent and its built-in screen is handy, but you would be matching your most expensive competitor's hardware spend while charging a fifth of their price.

## Full build

| Item | Price |
|---|---|
| Enclosure + shade flaps + customs | $3,328 |
| Canopy (black, 12x12) | $250 |
| BenQ AK700ST projector | $2,899 |
| Refurb RTX 3060 laptop, 16 GB | ~$750 |
| Bushnell Launch Pro | $2,999 |
| Launch Pro Silver plan, year one | $200 |
| **Subtotal** | **~$10,426** |

Remaining categories, with priced options in `EQUIPMENT-TIERS.md`:

| Item | Budget | Suggested |
|---|---|---|
| Hitting mat | $790 | SIGPRO Softy Lite 4'x5', shipping included |
| Landing turf | $670 | Landing Pad Turf 13'4" x 10' |
| Power | $899 | Jackery Explorer 2000 v2, indoor-safe, 2.6–4 hrs |
| Cabling | $221 | J-Tech wireless HDMI + wired backup |
| Surge protection | $29 | APC SurgeArrest PE625 |
| Misc | $200 | Balls, tees, bins, fan, gaffer tape |
| **Estimated all-in** | **~$13,235** | plus ~$200/yr software |

That lands between the Core and Premium templates: Premium-grade projector and launch monitor, with money saved on the computer by rendering at 1080p and on sun control by using a canopy instead of brightness.

If cash is tight at launch, swapping the Launch Pro for the Uneekor EYE MINI Lite brings it to roughly **$12,235**.
