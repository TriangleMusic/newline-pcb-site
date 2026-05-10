// Contact form: posts JSON to Web3Forms, shows inline status messages.
// Runs once for every <form class="contact-form"> on the page.

(function () {
  const lang = document.documentElement.lang === "he" ? "he" : "en";
  const STRINGS = {
    en: {
      sending: "Sending…",
      success: "Thank you for contacting us. We will get back to you as soon as possible.",
      error: "Oops, there was an error sending your message. Please try again later.",
      missingKey: "Form not configured yet. Please contact us by phone or email.",
    },
    he: {
      sending: "שולח…",
      success: "תודה שפנית אלינו. אנו נחזור אליך בהקדם האפשרי.",
      error: "אופס, אירעה שגיאה בשליחת ההודעה. בבקשה נסה שוב מאוחר יותר.",
      missingKey: "הטופס עדיין לא מוגדר. אנא צרו קשר בטלפון או במייל.",
    },
  }[lang];

  document.querySelectorAll(".contact-form").forEach((form) => {
    const button = form.querySelector("button[type='submit']");
    const status = form.querySelector(".form-status");
    const buttonOriginal = button ? button.textContent : "";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Honeypot — silently drop bots
      if (form.elements.botcheck && form.elements.botcheck.checked) return;

      const accessKey = form.elements.access_key && form.elements.access_key.value;
      if (!accessKey || accessKey.startsWith("YOUR_")) {
        showStatus("error", STRINGS.missingKey);
        return;
      }

      setSending(true);

      try {
        const data = new FormData(form);
        const payload = Object.fromEntries(data.entries());
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok && body.success) {
          showStatus("success", STRINGS.success);
          form.reset();
        } else {
          throw new Error(body.message || `HTTP ${res.status}`);
        }
      } catch (err) {
        console.error("[contact-form]", err);
        showStatus("error", STRINGS.error);
      } finally {
        setSending(false);
      }
    });

    function setSending(yes) {
      if (!button) return;
      button.disabled = yes;
      button.textContent = yes ? STRINGS.sending : buttonOriginal;
    }

    function showStatus(kind, message) {
      if (!status) return;
      status.classList.remove("is-success", "is-error");
      status.classList.add(kind === "success" ? "is-success" : "is-error");
      status.textContent = message;
      // Auto-clear after 8s on success
      if (kind === "success") {
        setTimeout(() => {
          status.classList.remove("is-success");
          status.textContent = "";
        }, 8000);
      }
    }
  });
})();
