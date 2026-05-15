# Athlete Bank, Pitch Site

The single-page pitch site for Athlete Bank, with two interactive calculators (5-year growth + micro-donation GMV) and a password-gated entry screen.

Live brand: black + neon yellow (`#d4ff00`) + dark forest green. Manila-folder product cards. Animated growth curve. No frameworks, no build step.

## What's in here

```
├── index.html          # The site, one page (includes inline password gate)
├── styles.css          # Brand system, components, animations
├── calculator.js       # Micro-donation GMV calculator logic
├── growth-calc.js      # 5-year cohort growth calculator logic
├── app.js              # Nav, scroll reveals, floating CTA menu, presets, mobile menu
├── favicon.svg         # The triangular "A" mark
├── og.svg              # Social share image (1200x630)
├── vercel.json         # Static deploy config (no build step needed)
└── README.md
```

Zero dependencies. Zero build step. Just HTML + CSS + vanilla JS.

## Password protection

The site loads behind a branded password gate. The gate paints before anything else, hiding all content from anyone without the password.

**Default password: `peak6`**

The password is verified by SHA-256 hash, so the plaintext password is not visible in View Source. Once entered correctly, a `sessionStorage` flag keeps the visitor unlocked for the duration of their browser session.

### Changing the password

In [`index.html`](./index.html), find the inline gate script (search for `GATE_HASH`). Generate a new SHA-256 hash of your chosen password:

```bash
# macOS / Linux
echo -n "yournewpassword" | shasum -a 256

# or Node
node -e "require('crypto').createHash('sha256').update('yournewpassword').digest('hex')"
```

Replace the value of `GATE_HASH` with the new hash. Done.

### A note on security

This is a **client-side gate**. Anyone determined enough — opening DevTools, inspecting source — could theoretically brute-force the hash or bypass the JS check. It's good for keeping the pitch out of casual hands and search-engine crawlers, but it is **not real cryptographic security**.

If the contents need genuine confidentiality, upgrade to Vercel's native **Password Protection** feature. As of early 2026 this requires either an Enterprise plan or the **Advanced Deployment Protection** add-on on Pro ($150/mo). Once enabled, Vercel intercepts every request at the edge and refuses to serve any HTML/asset to unauthorized visitors:

1. Vercel dashboard → your project → **Settings** → **Deployment Protection**
2. Pick a protection method: **Password Protection**
3. Pick a scope: **All Deployments** (or just production)
4. Set the password, save

When Vercel's native protection is on, you should remove the inline gate from `index.html` so visitors don't get two prompts. Delete the `<style>` block in `<head>` that contains `#gate`, the `<div id="gate">` element, and the two gate `<script>` blocks at the top of `<body>`.

## Sections

1. **Hero** — Banking the NIL Locker Room, three CTAs (See the pitch / Growth calculator / Micro-donation calculator), key-stat strip
2. **Problem** — The Texas Longhorns 19-year-old, three pain cards
3. **Stakes** — The bankruptcy/financial-literacy stats
4. **Product** — Four manila-folder cards (Banking, Wealth, Tax, Coach AI)
5. **Forcing Function** — Largest NIL clearing house, before/wedge/after flow
6. **Market** — 500K+ market hero + animated growth curve + two axes + **Growth calculator** (5-year cohort revenue model)
7. **Calculator** — Micro-donation GMV TAM calculator
8. **Why Now** — Three catalysts
9. **Field** — Scout vs Athlete Bank comparison
10. **Execution** — 18-month roadmap
11. **Coach AI** — Saban-K virality play
12. **Compliance** — Gambling surveillance + three principles
13. **Team** — Founder background (forest-green section)
14. **Why Peak6** — Sports DNA + Fintech DNA columns
15. **Structure** — Athlete Bank inside the Peak6 ecosystem (org chart)
16. **Ask** — Three things from Peak6
17. **Contact** — Reach out to Jesse CTA + email + domain mentions

Plus a sticky **floating "Run the numbers"** popout menu (bottom-right) that opens to offer a choice between the Growth and Micro-donation calculators. It appears after the hero, hides when either calculator is in view, and hides again near the footer.

## Local preview

```bash
# Python
python3 -m http.server 8000

# Or Node
npx serve .
```

Open <http://localhost:8000>. Use the default password `peak6` at the gate.

## Deploy to Vercel

### Path 1 — GitHub + Vercel dashboard (recommended)

```bash
git init
git add .
git commit -m "Initial Athlete Bank pitch site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/athletebank-site.git
git push -u origin main
```

Then go to <https://vercel.com/new>, import the repo, click **Deploy**. Vercel auto-detects the static site — no framework, no build command.

### Path 2 — Vercel CLI

```bash
npm install -g vercel
vercel              # preview URL
vercel --prod       # production
```

### Adding a custom domain

1. Vercel project → **Settings** → **Domains** → Add domain
2. Add `athletebank.com` (or whichever you snag)
3. Set the DNS records Vercel shows at your registrar
4. SSL provisions automatically within minutes

## Editing the calculators

### Micro-donation GMV calculator ([`calculator.js`](./calculator.js))

Segments live as a single array:

```js
{ tier: 'Top 16 football fan bases', athletes: '~1,360 scholarship', fans: 320000000 }
```

Add or remove segments. GMV = fans × conversion × ARPU. Bar rendering updates automatically.

Presets live in [`app.js`](./app.js):

```js
const presets = {
  conservative: { conv: 3, arpu: 50, take: 12 },
  base: { conv: 5, arpu: 80, take: 15 },
  engaged: { conv: 10, arpu: 120, take: 18 },
  top: { conv: 20, arpu: 200, take: 20 }
};
```

`conv` is in tenths of a percent (so `5` = 0.5%). `arpu` is dollars. `take` is percent.

### 5-year Growth calculator ([`growth-calc.js`](./growth-calc.js))

Cohorts:

```js
{ id: 'athletes', label: 'NIL athletes', size: 500_000, unlocks: 1 }
```

Each cohort has a size (addressable population) and an `unlocks` year (1–5) when it enters the funnel. Penetration ramps year over year. ARPU scales by an attach multiplier as customers age into wealth/lending/tax products.

Presets are at the top of the file (`conservative` / `base` / `bull` / `moon`).

## Reach out to Jesse — change the email

In [`index.html`](./index.html), there are three mailto links pointing to `davij615@gmail.com`:

- Nav CTA (top right): `"Reach out to Jesse"`
- Bottom contact section: `"Reach out to Jesse"` + the email shown as a button label
- Password gate: `"Need access?"` link + helper text

Search-and-replace `davij615@gmail.com` to update all of them at once.

## Brand system

| Token | Value | Use |
|---|---|---|
| `--black` | `#000000` | Hero, section backgrounds |
| `--bg-dark` | `#0a0a0a` | Alternating section backgrounds |
| `--bg-card` | `#161616` | Card backgrounds |
| `--green-deep` | `#08332a` | Forest section (Team) |
| `--yellow` | `#d4ff00` | Accents, CTAs, key numbers |
| `--green` | `#0a3d2e` | Dark panels, folder cards |
| `--mint` | `#c8e8d8` | Light panels, folder cards |
| `--text` | `#ffffff` | Body |
| `--text-muted` | `#a8a8a8` | Secondary text |
| `--border` | `#262626` | Hairlines, card borders |

Fonts: Inter (Google Fonts), weights 400–900.

## Animations

All section content uses `IntersectionObserver` for scroll-triggered fade-up reveals. The growth curve animates the line (stroke-dashoffset), the area fill, and the four year markers in sequence. The floating CTA menu uses a scale + fade-in. Respects `prefers-reduced-motion: reduce`.

## Performance

- One web font with `display=swap`
- ~8 KB total custom JS (app + calculator + growth-calc)
- ~60 KB CSS
- ~50 KB HTML
- Cache headers set in `vercel.json` for CSS/JS
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)

## What's intentionally missing

- No analytics — add Plausible / Fathom / Vercel Analytics in `index.html` `<head>` when ready
- No CMS — content is in HTML directly. Trade-off for simplicity and speed
- No CRM hook — the email links are `mailto:`. Wire to HubSpot / Salesforce when inbound volume warrants it
