// Lazy-load PhotoSwipe v5 from CDN and bind to gallery items.
// We import dynamically to keep the JS payload zero on pages
// that don't have a gallery.

import PhotoSwipeLightbox from "https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.min.js";

document.querySelectorAll(".gallery").forEach((gallery) => {
  const lightbox = new PhotoSwipeLightbox({
    gallery: gallery,
    children: "a",
    pswpModule: () =>
      import("https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.min.js"),
    showHideAnimationType: "fade",
    bgOpacity: 0.92,
  });

  // Resolve actual image dimensions on the fly (so we don't hard-code
  // 1920×1280 for every photo when the real height varies).
  lightbox.addFilter("itemData", (itemData) => {
    if (itemData.element && itemData.element.querySelector("img")) {
      const img = itemData.element.querySelector("img");
      // Best-effort dimensions; PhotoSwipe will use them if real values aren't loaded yet.
      itemData.width = itemData.width || img.naturalWidth || 1920;
      itemData.height = itemData.height || img.naturalHeight || 1280;
    }
    return itemData;
  });

  lightbox.init();
});
