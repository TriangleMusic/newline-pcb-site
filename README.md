# NewLine PCB — Static Site

Bilingual (English / Hebrew) brochure site for [NewLine PCB Ltd.](https://newline-pcb.com), built with [Eleventy](https://www.11ty.dev/) and deployed to [Cloudflare Pages](https://pages.cloudflare.com/).

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

Pushing to the `main` branch automatically triggers a Cloudflare Pages build and deploy. No GitHub Action needed — Cloudflare watches the GitHub repo directly.

Build settings (configured once in the Cloudflare dashboard):

| Setting              | Value         |
|----------------------|---------------|
| Framework preset     | None          |
| Build command        | `npm run build` |
| Build output directory | `_site`     |
| Root directory       | (leave empty) |
| Node version (env var `NODE_VERSION`) | `20` |

## First-time Cloudflare Pages setup

1. Sign in (or sign up — free) at https://dash.cloudflare.com/.
2. **Compute (Workers & Pages)** → **Create** → **Pages** → **Connect to Git**.
3. Authorize Cloudflare to access GitHub, then select the `newline-pcb-site` repository.
4. **Set up builds and deployments**:
   - Project name: `newline-pcb`
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `_site`
   - Add environment variable: `NODE_VERSION` = `20`
5. **Save and Deploy**. The first build takes ~1–2 min. Cloudflare will give you a URL like `https://newline-pcb.pages.dev`.
6. After it's green, go to **Custom domains** → **Set up a custom domain** → enter `newline-pcb.com`. Cloudflare will instruct you on the DNS record to add (see below).

## Domain (DNS) setup

There are two paths, depending on whether the domain's nameservers are at the original registrar or moved to Cloudflare.

### Path A: Move the domain to Cloudflare DNS (recommended, simplest)

This is the easiest and fastest path because Cloudflare adds the right records automatically.

1. In Cloudflare dashboard: **Add a Site** → enter `newline-pcb.com` → choose **Free plan**.
2. Cloudflare will scan your existing DNS and import all current records (including MX for email — important!). **Verify the MX records imported correctly** before continuing.
3. Cloudflare will give you 2 nameservers (e.g. `ana.ns.cloudflare.com` and `bob.ns.cloudflare.com`).
4. Log into your domain registrar (where you originally bought the domain) and **change the nameservers** to those two values.
5. Wait for propagation (usually 5 minutes – 24 hours).
6. After Cloudflare confirms the nameserver change, go back to your Pages project → **Custom domains** → add `newline-pcb.com`. Cloudflare will auto-create the records and issue an SSL cert.

### Path B: Keep the domain at the existing registrar

If you don't want to move nameservers, just add records at the registrar pointing at Cloudflare Pages:

```
CNAME   @       newline-pcb.pages.dev    (or apex ALIAS / ANAME if your registrar supports it)
CNAME   www     newline-pcb.pages.dev
```

Some registrars don't support CNAME on the apex (`@`). In that case, **Path A is required**.

### Pre-flight checklist (do 24 hours before)

- Lower the TTL on existing A/CNAME records to **300 seconds** at the current registrar.
- Verify your **MX records** for `info@newline-pcb.com`. They must NOT point to Duda's mail servers, or you'll lose email when you cut over.

### Verifying

```bash
dig +short newline-pcb.com
curl -I https://newline-pcb.com/
# Should return HTTP/2 200 and Server: cloudflare
```

### Decommissioning Duda

Wait 48 hours after the cutover with everything working before cancelling Duda. Don't let it auto-renew.

### Rollback

If something goes wrong, restore the previous A/CNAME records at the registrar. With TTL=300, traffic flips back within minutes.

## Adding gallery images

Drop new images into `src/assets/img/gallery/multilayer/` (or `flex-rigid/`) following the naming pattern `NN-full.jpg` and `NN-thumb.jpg` (where `NN` is two digits, e.g. `13`). Then edit the `range(1, 13)` loop in `src/multilayer-pcb.njk` to include the new index, and similarly in `src/he/multilayer-pcb.njk`.

For best results, full images should be ~1920px wide JPEGs and thumbs should be ~600px on the long edge.

## License

Source code: MIT. All site content (text, images, logos) © NewLine PCB Ltd.
