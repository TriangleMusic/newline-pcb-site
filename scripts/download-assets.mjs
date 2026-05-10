// Downloads all images from the original Duda CDN to src/assets/img/.
// Idempotent: skips files that already exist on disk.
//
// Usage:  node scripts/download-assets.mjs

import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMG_DIR = join(ROOT, "src", "assets", "img");

// Source CDN bases
const LIRP = "https://lirp.cdn-website.com/f8eeb30b/dms3rep/multi/opt";
const IRP = "https://irp-cdn.multiscreensite.com/f8eeb30b/dms3rep/multi";
const FAVICON = "https://irp-cdn.multiscreensite.com/f8eeb30b";

// All assets we need: [sourceUrl, destPath]
const ASSETS = [
  // Logo (color, used on light/white backgrounds)
  [`${LIRP}/NLP+Logo_12-1920w.png`, "logo.png"],
  // Logo (white, used on the blue footer)
  [`${LIRP}/NLP+Logo_-1920w.png`, "logo-white.png"],
  // Favicon
  [`${FAVICON}/site_favicon_16_1534674875079.ico`, "favicon.ico"],
  [`${IRP}/85b7ae80-b084-4402-b6d3-dfe67f80682e.png`, "apple-touch-icon.png"],
  [`${LIRP}/Untitled-2-1920w.png`, "og-image.png"],

  // Hero / section backgrounds
  // Original hero filename was Hebrew "באנר2" URL-encoded → rename to ASCII
  [`${LIRP}/%D7%91%D7%90%D7%A0%D7%A82-52ee3159-1920w.jpg`, "hero-banner.jpg"],
  // Macro PCB shot — used on home right-panel and contact hero bg
  [`${LIRP}/818-1920w.jpg`, "pcb-macro.jpg"],
  // About page hero (bigger PCB macro)
  [`${LIRP}/819-2880w.jpg`, "about-pcb.jpg"],
  // Contact form section bg (Intel CPU on mobo)
  [
    "https://lirp.cdn-website.com/md/unsplash/dms3rep/multi/opt/photo-1513366976578-e01c21fb9c76-1920w.jpg",
    "contact-cpu.jpg",
  ],

  // Homepage project tiles (4)
  [`${IRP}/s2_1350903490.jpg`, "projects/flex-rigid.jpg"],
  [`${IRP}/s2_1350903349.jpg`, "projects/multilayer.jpg"],
  [`${IRP}/s2_1352710385.jpg`, "projects/flexible.jpg"],
  [`${IRP}/s2_1352710430.jpg`, "projects/aluminum.jpg"],

  // Multilayer PCB gallery (12) — full + thumb
  ...[
    "1350905967",
    "1350905976",
    "1350903342",
    "1350903367",
    "1350903349",
    "1350903337",
    "1350903316",
    "1350903359",
    "1350903324",
    "1350903289",
    "1350903332",
    "1350903299",
  ].flatMap((id, i) => {
    const n = String(i + 1).padStart(2, "0");
    return [
      [`${LIRP}/s2_${id}-1920w.jpg`, `gallery/multilayer/${n}-full.jpg`],
      [`${LIRP}/s2_${id}-600h.jpg`, `gallery/multilayer/${n}-thumb.jpg`],
    ];
  }),

  // Flex-rigid gallery (3) — full + thumb
  ...["1350903490", "1350903483", "1352710318"].flatMap((id, i) => {
    const n = String(i + 1).padStart(2, "0");
    return [
      [`${LIRP}/s2_${id}-1920w.jpg`, `gallery/flex-rigid/${n}-full.jpg`],
      [`${LIRP}/s2_${id}-600h.jpg`, `gallery/flex-rigid/${n}-thumb.jpg`],
    ];
  }),

  // Language flags (32px PNG)
  ["https://dd-cdn.multiscreensite.com/flags/flags_iso/32/us.png", "flags/us.png"],
  ["https://dd-cdn.multiscreensite.com/flags/flags_iso/32/il.png", "flags/il.png"],
];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function download(url, destRel) {
  const dest = join(IMG_DIR, destRel);
  if (await exists(dest)) {
    console.log(`  skip   ${destRel} (already exists)`);
    return { ok: true, skipped: true };
  }
  await mkdir(dirname(dest), { recursive: true });
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
      },
    });
    if (!res.ok) {
      console.error(`  FAIL   ${destRel}  →  HTTP ${res.status} ${res.statusText}`);
      return { ok: false, error: `HTTP ${res.status}` };
    }
    const buf = new Uint8Array(await res.arrayBuffer());
    await writeFile(dest, buf);
    const kb = (buf.byteLength / 1024).toFixed(1);
    console.log(`  ok     ${destRel}  (${kb} KB)`);
    return { ok: true };
  } catch (err) {
    console.error(`  FAIL   ${destRel}  →  ${err.message}`);
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log(`Downloading ${ASSETS.length} assets to src/assets/img/ ...`);
  const results = await Promise.all(ASSETS.map(([url, dest]) => download(url, dest)));
  const ok = results.filter((r) => r.ok).length;
  const skipped = results.filter((r) => r.skipped).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\nDone: ${ok} ok (${skipped} cached), ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main();
