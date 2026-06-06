# Four Pillars of Destiny — Saju Reading Site

A multi-page, AI-free English-language Saju (四柱 / 사주 / BaZi) educational site.
Targets English speakers curious about Korean/East Asian birth-chart symbolism.

## What's inside

```
saju-site/
├── index.html         Main page: calculator + chart results + FAQ
├── about.html         About the project, methodology, sources
├── contact.html       Contact form (mailto-based) + social links
├── privacy.html       Privacy policy (AdSense-required)
├── terms.html         Terms of service
├── sitemap.xml        XML sitemap for search engines
├── robots.txt         Crawler directives
├── _headers           Cloudflare Pages security headers
├── README.md          This file
├── LICENSE            MIT
└── dev/
    ├── test-saju.js   Node.js test of the Saju algorithm
    ├── test-lunar.js  Node.js test of the lunar-to-solar conversion
    ├── smoke.js       Quick smoke test
    └── check.js       Script-block syntax check
```

## How to use locally

Open `index.html` in any modern browser.

```bash
# macOS
open index.html
# Linux
xdg-open index.html
# Windows
start index.html
```

Everything runs in the browser. No server, no network calls, no AI for the reading.

## How to deploy to Cloudflare Pages

### Option A — Drag & drop (easiest)

1. Sign in to https://dash.cloudflare.com/
2. Go to **Workers & Pages** → **Pages** → **Create application** → **Pages** → **Upload assets**
3. Give your project a name
4. **Drag the `saju-site` folder** into the upload area
5. Click **Deploy site**

### Option B — Connect to Git

1. Push `saju-site/` to a GitHub repo
2. In Cloudflare Pages, choose **Connect to Git** → pick the repo
3. Build settings:
   - **Framework preset**: `None`
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/` (root)
4. **Save and Deploy**

### Custom domain

Cloudflare Pages → your project → **Custom domains** → **Set up a custom domain**.

## Algorithm notes

The Saju calculation is implemented in pure JavaScript:

- **Year pillar**: based on the 60-제기 (sexagenary) cycle from 1984 = 甲子. The 입춘 (Start of Spring, ~Feb 4) cutoff is used for year boundary.
- **Month pillar**: derived from solar-term (절기) dates. The 12 month branches are mapped to approximate day-of-year ranges (acceptable ±1 day error on term-transition days).
- **Day pillar**: computed via Julian Day Number (JDN) using the well-known reference Jan 1, 1900 = 甲戌 day. Algorithm: `stem = (JDN - 11) mod 10`, `branch = (JDN + 1) mod 12`.
- **Hour pillar**: derived from the day stem and the 2-hour 시진 blocks. 23:00–00:59 is treated as 子시 of the current calendar day.
- **Lunar input**: a lookup table for 1900–2099 converts lunar dates to solar before calculation.

### Accuracy

Algorithm verified against:
- Jan 1, 2000 = 戊午 day
- 1984 = 甲子 year, 2008 = 戊子 year, 2024 = 甲辰 year
- 60-day cycle wrap-around
- 입춘 (Feb 4) year boundary
- Lunar New Year conversions for multiple years

Run `node dev/test-saju.js` and `node dev/test-lunar.js` to re-verify.

## SEO / AEO / GEO

The site is optimized for traditional search (SEO), answer engines (AEO), and generative engines (GEO):

- **SEO**: canonical URLs, Open Graph, Twitter Card, sitemap.xml, robots.txt, breadcrumb navigation, semantic HTML5, descriptive headings
- **AEO**: FAQPage JSON-LD schema, direct Q&A sections, HowTo schema for chart-reading steps
- **GEO**: WebApplication + Organization schema, E-E-A-T signals (About page with methodology and sources), structured descriptions of what the system is and isn't

## AdSense

- Publisher ID: `ca-pub-1955893232253258`
- Auto ad slots are placed in the main content (after hero section, between sections, above the footer) and on every legal page
- The site is intentionally framed as **educational and cultural**, not fortune-telling, to comply with AdSense content policies
- A strong disclaimer is included in every chart result

## Customization

- **Readings**: edit `DAY_MASTER`, `BRANCH_INFO`, and `LUCKY` objects in `index.html` (inside the main `<script>` block)
- **Design**: all CSS is in the `<style>` block at the top of `index.html` (and the other pages). Accent color: search for `#d4af37`
- **Pages**: each page is standalone — duplicate `about.html` to add new ones

## Privacy

The site does not call any external API for chart calculation, does not use cookies, and does not track users. All chart calculation happens in the user's browser. Birth data never leaves the device. The only third-party network calls are Google AdSense ad tags, which are clearly labeled.

## License

MIT. The Four Pillars system itself is a 3,000-year-old cultural heritage and not subject to copyright.

## How to use locally

Just open `index.html` in any modern browser. That's it.

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Everything runs in the browser. No server, no network calls, no AI.

## How to deploy to Cloudflare Pages

### Option A — Drag & drop (easiest)

1. Sign in to https://dash.cloudflare.com/
2. Go to **Workers & Pages** → **Pages** → **Create application** → **Pages** → **Upload assets**
3. Give your project a name (this becomes your `*.pages.dev` subdomain)
4. **Drag the `saju-site` folder** into the upload area
5. Click **Deploy site**
6. Done. Your site is live at `https://<your-project>.pages.dev` within ~30 seconds

### Option B — Connect to Git (recommended for updates)

1. Push `saju-site/` to a GitHub/GitLab repo
2. In Cloudflare Pages, choose **Connect to Git**
3. Pick your repo
4. Build settings:
   - **Framework preset**: `None`
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/` (root of the project, or `.`)
5. Click **Save and Deploy**
6. Every push to `main` auto-deploys

### Custom domain

In Cloudflare Pages → your project → **Custom domains** → **Set up a custom domain** → follow prompts.

## Algorithm notes

The Saju calculation is implemented in pure JavaScript:

- **Year pillar**: based on the 60-제기 (sexagenary) cycle from 1984 = 甲子. The 입춘 (Start of Spring, ~Feb 4) cutoff is used for year boundary.
- **Month pillar**: derived from solar-term (절기) dates. The 12 month branches are mapped to approximate day-of-year ranges (acceptable ±1 day error on term-transition days).
- **Day pillar**: computed via Julian Day Number (JDN) using the well-known reference Jan 1, 1900 = 甲戌 day. Algorithm: `stem = (JDN - 11) mod 10`, `branch = (JDN + 1) mod 12`.
- **Hour pillar**: derived from the day stem and the 2-hour 시진 blocks. 23:00–00:59 is treated as 子시 of the current calendar day.
- **Lunar input**: a lookup table for 1900–2099 converts lunar dates to solar before calculation.

### Accuracy

Algorithm verified against:
- Jan 1, 2000 = 戊午 day (verified against multiple 만세력 sources)
- 1984 = 甲子 year, 2008 = 戊子 year, 2024 = 甲辰 year
- 60-day cycle wrap-around
- 입춘 (Feb 4) year boundary
- Lunar New Year conversions for multiple years (1990, 1984, 2000, 2000 Chuseok)

Standard caveat: dates falling exactly on a solar-term transition can be off by ±1 day in any Saju calculator. For a more accurate (but larger) implementation, embed a per-year solar-term date table.

## Customization

- **Readings**: edit the `DAY_MASTER`, `BRANCH_INFO`, and `LUCKY` objects in the `<script>` block to change voice, add nuance, or support additional languages.
- **Design**: all CSS is at the top of `index.html` inside `<style>`. Change accent colors with `--gold` (search for `#d4af37`).
- **Disclaimer text**: edit the `.disclaimer` block in `render()`.

## Privacy

The site does not call any external API, does not use cookies, does not track users, and does not include any analytics. All calculation happens in the user's browser. Birth data never leaves the device.

## License

MIT — fork, modify, brand, sell, whatever. The Saju system itself is thousands of years old and not subject to copyright.

---

Built for English-speaking seekers of the four pillars. No login. No ads. No AI. Just the stars.
