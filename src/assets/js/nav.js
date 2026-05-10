// Mobile nav toggle. Adds/removes `.is-open` on the <nav> when the
// hamburger button is clicked, and keeps aria-expanded in sync.

(function () {
  const nav = document.querySelector(".nav");
  const toggle = nav && nav.querySelector(".nav__toggle");
  if (!nav || !toggle) return;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close when a nav link is clicked (mobile only)
  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 900px)").matches) {
        setOpen(false);
      }
    });
  });

  // Close on viewport upsize
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
})();
