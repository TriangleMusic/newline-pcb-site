# NewLine PCB — Static Site

Bilingual (English / Hebrew) brochure site for [NewLine PCB Ltd.](https://newline-pcb.com), built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Quick start

```bash
npm install              # one-time
npm run assets           # download images from old site (one-time, idempotent)
npm run dev              # local dev server at http://localhost:8080
npm run build            # produces _site/ ready to deploy
```

Requires Node.js 18+ (any modern version works).

## Project layout

```
src/
├── _data/
│   ├── site.json        ← phone, email, WhatsApp, address, Web3Forms key
│   └── i18n.js          ← UI translations (nav labels, footer, form copy)
├── _includes/
│   ├── layout-en.njk    ← English HTML shell (LTR)
│   ├── layout-he.njk    ← Hebrew HTML shell (RTL)
│   ├── header.njk       ← top bar + nav (lang-aware)
│   ├── footer.njk       ← blue footer (lang-aware)
│   ├── whatsapp-fab.njk ← floating WhatsApp button
│   └── contact-form.njk ← reusable Web3Forms form
├── assets/
│   ├── css/             ← tokens, base, components, rtl
│   ├── js/              ← nav.js, form.js, lightbox.js
│   └── img/             ← logos, hero photos, gallery
├── index.njk            ← English home (/)
├── about.njk            ← /about/
├── multilayer-pcb.njk   ← /multilayer-pcb/
├── flex-rigid-pcb.njk   ← /flex-rigid-pcb/
├── contact.njk          ← /contact/
└── he/
    └── (mirror of the above under /he/)
```

## Editing content

Most text edits happen in the `.njk` files in `src/`. The Hebrew and English versions of each page are separate files (`src/about.njk` and `src/he/about.njk`) so you can edit each independently.

To change the company phone, email, address, or WhatsApp number — edit `src/_data/site.json` and they update everywhere automatically.

To change UI labels (navigation menu items, "Submit" / "Send" button text, footer headings) — edit `src/_data/i18n.js`.

## Setting up the contact form (one-time)

The contact form uses [Web3Forms](https://web3forms.com/) — free, 250 submissions/month, no signup. Get an access key:

1. Go to https://web3forms.com/
2. Enter the email address that should receive contact-form submissions (e.g. `info@newline-pcb.com`).
3. Web3Forms will email you an access key.
4. Open `src/_data/site.json`, replace `"YOUR_WEB3FORMS_KEY_HERE"` with the key.
5. Commit and push — Actions will rebuild the site within ~1 minute.

Until you've done this, the form will display an error if anyone tries to submit.

## Deploying

Pushing to the `main` branch automatically builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`. No manual steps.

First-time GitHub Pages setup (in the repo on github.com):

1. **Settings → Pages → Source**: select **GitHub Actions**.
2. **Settings → Pages → Custom domain**: enter `newline-pcb.com` (this matches the `src/CNAME` file).
3. After DNS is configured (see below), tick **Enforce HTTPS**.

## Domain (DNS) setup

Currently `newline-pcb.com` resolves through the old Duda site. To repoint to GitHub Pages:

### 1. Pre-flight (24 hours before cutover)

At the domain registrar, lower the TTL on existing A/CNAME records to **300 seconds (5 minutes)**. This shortens propagation when you flip the records.

Verify your **MX records** (email routing) are NOT pointing to Duda — if `info@newline-pcb.com` is hosted by Duda's mail, you need to migrate email first. If MX points to Google, Microsoft 365, or another provider, you're good.

### 2. Repoint DNS at your registrar

Replace the existing A/CNAME with:

| Type  | Name | Value                |
|-------|------|----------------------|
| A     | @    | 185.199.108.153      |
| A     | @    | 185.199.109.153      |
| A     | @    | 185.199.110.153      |
| A     | @    | 185.199.111.153      |
| AAAA  | @    | 2606:50c0:8000::153  |
| AAAA  | @    | 2606:50c0:8001::153  |
| AAAA  | @    | 2606:50c0:8002::153  |
| AAAA  | @    | 2606:50c0:8003::153  |
| CNAME | www  | TriangleMusic.github.io. |

Replace `TriangleMusic` with your GitHub username if different. The trailing `.` on the CNAME is important.

> If your registrar is behind Cloudflare, set the proxy status to **DNS only** (grey cloud icon, not orange). GitHub Pages issues its own SSL via Let's Encrypt and that conflicts with Cloudflare proxy.

### 3. Wait for propagation

Most registrars finish within 5 minutes; some take up to a few hours. Check with:

```bash
dig +short newline-pcb.com
# Should return four 185.199.x.153 IPs
```

### 4. Enable HTTPS in GitHub

In the repo: **Settings → Pages → Custom domain** — GitHub will run a DNS verification automatically. Once it passes, an "Enforce HTTPS" checkbox appears (this can take 15 minutes to a few hours after DNS propagates). Tick it.

### 5. Verify

```bash
curl -I https://newline-pcb.com/
```

Should return `HTTP/2 200` and `Server: GitHub.com`.

### 6. Decommission Duda

After 48 hours of stable operation on the new site, cancel the Duda subscription. Don't let it auto-renew.

### Rollback path

If anything breaks post-cutover, restore the previous A/CNAME records at the registrar — the TTL was already lowered to 300s, so propagation is fast.

## Adding gallery images

Drop new images into `src/assets/img/gallery/multilayer/` (or `flex-rigid/`) following the naming pattern `NN-full.jpg` and `NN-thumb.jpg` (where `NN` is two digits, e.g. `13`). Then edit the `range(1, 13)` loop in `src/multilayer-pcb.njk` to include the new index, and similarly in `src/he/multilayer-pcb.njk`.

For best results, full images should be ~1920px wide JPEGs and thumbs should be ~600px on the long edge.

## License

Source code: MIT. All site content (text, images, logos) © NewLine PCB Ltd.
