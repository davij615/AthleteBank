# Athlete Bank, Pitch Site

The single-page pitch site for Athlete Bank, with an interactive College GMV calculator built in.

Live brand: black + neon yellow (`#d4ff00`) + dark forest green. Manila-folder product cards. Animated growth curve. No frameworks, no build step.

## What's in here

```
├── index.html          # The site, one page
├── styles.css          # Brand system, components, animations
├── calculator.js       # Interactive GMV TAM calculator logic
├── app.js              # Nav, scroll reveals, floating CTA, presets, mobile menu
├── favicon.svg         # The triangular "A" mark
├── og.svg              # Social share image (1200x630)
├── vercel.json         # Static deploy config (no build step needed)
└── README.md
```

Zero dependencies. Zero build step. Just HTML + CSS + vanilla JS. Total page weight under 200KB.

## Sections

1. **Hero**, Banking the NIL Locker Room, with key-stat strip ($2.75B · 500K+ · 18mo) and scroll cue
2. **Problem**, The Texas Longhorns 19-year-old, three pain cards
3. **Stakes**, The bankruptcy/financial-literacy stats
4. **Product**, Four manila-folder cards (Banking, Wealth, Tax, Coach AI) with custom icons
5. **Forcing Function**, Largest NIL clearing house, two distribution rails (donate / tip)
6. **Market**, 500K+ market hero + animated SVG growth curve + two axes of expansion
7. **Calculator**, Live GMV calculator with preset scenarios (conservative / base / engaged / top)
8. **Why Now**, Three catalysts
9. **Execution**, 18-month roadmap
10. **Team**, Forest-green section, founder background
11. **Why Peak6**, Sports DNA + Fintech DNA columns
12. **Ask**, Three things from Peak6
13. **Contact**, Schedule a call CTA + email + domain mentions

Plus a sticky **floating "Run the GMV"** CTA that appears after the hero and disappears near the calculator and footer.

## Local preview

```bash
# Python (any version)
python3 -m http.server 8000

# Or Node
npx serve .
```

Open <http://localhost:8000>.

## Deploy to Vercel

### Path 1, GitHub + Vercel dashboard (recommended)

```bash
git init
git add .
git commit -m "Initial Athlete Bank pitch site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/athletebank-site.git
git push -u origin main
```

Then go to <https://vercel.com/new>, import the repo, click **Deploy**. Vercel auto-detects the static site, no framework selection, no build command.

### Path 2, Vercel CLI

```bash
npm install -g vercel
vercel              # preview URL
vercel --prod       # production
```

### Adding your custom domain

Once deployed:
1. Vercel project → **Settings** → **Domains** → Add domain
2. Add `athletebank.com` (or `athlete.com`, whichever you snag)
3. Vercel will show you the DNS records to set at your registrar
4. SSL provisions automatically within minutes

## Editing the calculator

Calculator data lives in [`calculator.js`](./calculator.js) as a single `segments` array:

```js
{ tier: 'Top 16 football fan bases', athletes: '~1,360 scholarship', fans: 79000000 }
```

Add or remove segments. The math (GMV = fans × conversion × ARPU) and bar rendering update automatically.

Preset scenarios live in [`app.js`](./app.js):

```js
const presets = {
  conservative: { conv: 3, arpu: 50, take: 12 },
  base: { conv: 5, arpu: 80, take: 15 },
  engaged: { conv: 10, arpu: 120, take: 18 },
  top: { conv: 20, arpu: 200, take: 20 }
};
```

`conv` is in tenths of a percent (so `5` = 0.5%). `arpu` is dollars. `take` is percent.

## Editing the schedule-a-call link

In [`index.html`](./index.html), the Contact section has:

```html
<a href="https://cal.com/athletebank/peak6" class="btn btn-primary btn-large">Schedule a call →</a>
```

Replace with your real Cal.com / Calendly / SavvyCal link. Replace `founder@athletebank.com` in the same section with your real email.

## Brand system

| Token | Value | Use |
|---|---|---|
| `--black` | `#000000` | Hero, section backgrounds |
| `--bg-dark` | `#0a0a0a` | Alternating section backgrounds |
| `--green-deep` | `#08332a` | Forest section (Team) |
| `--yellow` | `#d4ff00` | Accents, CTAs, key numbers, folder card |
| `--green` | `#0a3d2e` | Dark panels, folder card |
| `--mint` | `#c8e8d8` | Light panels, folder card |
| `--text` | `#ffffff` | Body |
| `--text-muted` | `#a8a8a8` | Secondary text |

Fonts: Inter (Google Fonts), weights 400–800.

## Animations

All section content uses `IntersectionObserver` for scroll-triggered fade-up reveals. The growth curve in the Market section animates the line (stroke-dashoffset), the area fill, and the four year markers in sequence.

Respects `prefers-reduced-motion: reduce`, all animations disable for users who request it.

## Performance

- One web font with `display=swap`
- ~4KB total custom JS
- ~20KB CSS
- ~25KB HTML
- Cache headers set in `vercel.json` for CSS/JS
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)

## What's intentionally missing

- No analytics, add Plausible / Fathom / Vercel Analytics in `index.html` `<head>` when ready
- No CMS, content is in HTML directly. Trade-off for simplicity and speed
- No CRM hook, the email link is a `mailto:`. Wire to HubSpot / Salesforce when you have inbound volume
