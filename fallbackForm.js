/* =========================================================
   fallbackForm.js — OFFLINE FORM (Premium UI)
   - Same UI / behaviour as advancedForm.js
   - Separate overlay: #fallbackFormOverlay
   - Uses CSS from /css/allform.css
   - Uses window.APLL_COUNTRIES from countriesCode.js
   - Smart phone parsing + validation (your rules)
   ========================================================= */

console.log("[fallbackForm] Loaded (OFFLINE PREMIUM VERSION)");

(function () {

    // Avoid duplicates
    if (document.querySelector("#fallbackFormOverlay")) return;

    // -----------------------------------------------------
    // LOAD CSS
    // -----------------------------------------------------
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/allform.css";
    document.head.appendChild(link);

    // -----------------------------------------------------
    // HTML — Premium layout
    // -----------------------------------------------------
    const overlay = document.createElement("div");
    overlay.id = "fallbackFormOverlay";
    overlay.innerHTML = `
      <div id="apllFormBox" role="dialog" aria-modal="true" aria-label="Book an appointment">
        <button id="apllCloseIcon" type="button" aria-label="Close form">×</button>

        <div id="apllFormChip">
          <span id="apllFormChipDot"></span>
          <span>Easy WhatsApp Booking</span>
        </div>

        <h2>Book an Appointment</h2>
        <p id="apllFormSubtitle">
          Choose your service, date and time — we will contact you on WhatsApp.
        </p>

        <form id="apllForm">

          <label for="apllService">Service</label>
          <input id="apllService" type="text" readonly autocomplete="off" />

          <label for="apllName">Name</label>
          <input id="apllName" type="text" placeholder="Your name"
                 autocomplete="name" required />

          <label for="apllEmail">Email</label>
          <input id="apllEmail" type="email" placeholder="Your email"
                 autocomplete="email" required />

          <label>Phone</label>
          <div class="apll-phone-row">
            <select id="apllCountry" class="apll-country-select" required></select>
            <input id="apllPhone" type="tel" placeholder="Your number"
                   inputmode="tel" autocomplete="tel" required />
          </div>

          <label for="apllDate">Date</label>
          <input id="apllDate" type="date" required autocomplete="off" />

          <label for="apllTime">Time</label>
          <select id="apllTime" required>
            <option value="">Select a time</option>
          </select>

          <button id="apllSubmit" type="submit">
            <span>Send via WhatsApp</span>
          </button>

          <button id="apllClose" type="button">
            <span>Close</span>
          </button>

        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    // -----------------------------------------------------
    // JS LOGIC
    // -----------------------------------------------------

    const WHATSAPP = "393318358086";

    const TIME_SLOTS = [
      "09:00","09:30","10:00","10:30",
      "11:00","11:30","15:00","15:30",
      "16:00","16:30","17:00","17:30"
    ];

    const serviceField = overlay.querySelector("#apllService");
    const nameField    = overlay.querySelector("#apllName");
    const emailField   = overlay.querySelector("#apllEmail");
    const countrySel   = overlay.querySelector("#apllCountry");
    const phoneField   = overlay.querySelector("#apllPhone");
    const dateField    = overlay.querySelector("#apllDate");
    const timeField    = overlay.querySelector("#apllTime");

    const submitBtn    = overlay.querySelector("#apllSubmit");
    const closeBtn     = overlay.querySelector("#apllClose");
    const closeIconBtn = overlay.querySelector("#apllCloseIcon");

    // -----------------------------------------------------
    // Countries dropdown
    // -----------------------------------------------------
    function populateCountries() {
      const list = window.APLL_COUNTRIES;
      if (!Array.isArray(list) || !list.length) {
        console.error("[fallbackForm] APLL_COUNTRIES missing or empty");
        return;
      }

      // Optional: sort by name
      list
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(c => {
          const opt = document.createElement("option");
          opt.value = c.code; // e.g. "+39"
          opt.textContent = `${c.flag} ${c.code}`;
          opt.dataset.iso = c.iso;
          countrySel.appendChild(opt);
        });

      // Default Italy
      const defaultCode = "+39";
      if (list.some(c => c.code === defaultCode)) {
        countrySel.value = defaultCode;
      } else {
        countrySel.selectedIndex = 0;
      }

      console.log("[fallbackForm] Countries loaded:", list.length);
    }

    populateCountries();

    // -----------------------------------------------------
    // Phone helpers
    // -----------------------------------------------------

    // Guard to avoid recursive input events
    let updatingPhoneProgrammatically = false;

    // Parse international string like "+3933190..." or "00393319..."
    function parseInternational(raw) {
      if (!raw) return null;

      let s = String(raw).trim();
      if (!s.startsWith("+") && !s.startsWith("00")) return null;

      // 00 → +
      if (s.startsWith("00")) {
        s = "+" + s.slice(2);
      }

      // Keep only "+" and digits
      s = s.replace(/[^\d+]/g, "");
      if (!s.startsWith("+")) return null;

      const countries = Array.isArray(window.APLL_COUNTRIES)
        ? window.APLL_COUNTRIES
        : [];

      let best = null;
      for (const c of countries) {
        if (s.startsWith(c.code)) {
          if (!best || c.code.length > best.code.length) {
            best = c;
          }
        }
      }

      if (!best) return null;

      const localDigits = s
        .slice(best.code.length)   // remove +39
        .replace(/\D/g, "");       // digits only

      return {
        country: best,
        local: localDigits
      };
    }

function sanitizeLocalDigits(raw) {
  if (!raw) return "";
  return String(raw).replace(/[^\d+]/g, ""); // allow digits + plus sign
}

    // Basic country-based validation (local/national number)
    function isValidLocalNumber(code, localDigits) {
      const len = localDigits.length;

      switch (code) {
        case "+39": // Italy mobile usually 9–11 digits incl leading 3
          return len >= 8 && len <= 11;
        case "+91": // India
          return len === 10;
        case "+92": // Pakistan
          return len === 10;
        case "+880": // Bangladesh
          return len >= 9 && len <= 11;
        case "+1": // US/Canada
          return len === 10;
        default:
          // generic: 6–15 digits
          return len >= 6 && len <= 15;
      }
    }

    // -----------------------------------------------------
    // Phone input behaviour
    // -----------------------------------------------------
    phoneField.addEventListener("input", () => {
      if (updatingPhoneProgrammatically) return;

      let raw = phoneField.value;

      // If user starts with + or 00 → try to detect country
      if (raw.startsWith("+") || raw.startsWith("00")) {
        const parsed = parseInternational(raw);
        if (parsed) {
          updatingPhoneProgrammatically = true;
          countrySel.value = parsed.country.code;
          phoneField.value = parsed.local;        // only local digits
          updatingPhoneProgrammatically = false;
          return;
        }
      }

      // Normal typing: keep only digits
      const digits = sanitizeLocalDigits(raw);
      if (digits !== raw) {
        updatingPhoneProgrammatically = true;
        phoneField.value = digits;
        updatingPhoneProgrammatically = false;
      }
    });

    // Also sanitize on blur (in case autofill happens after load)
    phoneField.addEventListener("blur", () => {
      if (updatingPhoneProgrammatically) return;

      const raw = phoneField.value;
      if (!raw) return;

      // If blur value still starts with + / 00 → try one more time
      if (raw.startsWith("+") || raw.startsWith("00")) {
        const parsed = parseInternational(raw);
        if (parsed) {
          updatingPhoneProgrammatically = true;
          countrySel.value = parsed.country.code;
          phoneField.value = parsed.local;
          updatingPhoneProgrammatically = false;
          return;
        }
      }

      const clean = sanitizeLocalDigits(raw);
      if (clean !== raw) {
        updatingPhoneProgrammatically = true;
        phoneField.value = clean;
        updatingPhoneProgrammatically = false;
      }
    });

    // -----------------------------------------------------
    // Date setup
    // -----------------------------------------------------
    const today   = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);

    const toInput = d => d.toISOString().split("T")[0];

    const todayStr = toInput(today);
    dateField.min  = todayStr;
    dateField.max  = toInput(maxDate);
    dateField.value = todayStr;

    function isClosedDate(d) {
      const day = d.getDay();
      return day === 0 || day === 6;
    }

    function fillTimeSlots() {
      const d = new Date(dateField.value + "T00:00");
      timeField.innerHTML = "";

      if (isClosedDate(d)) {
        timeField.disabled = true;
        timeField.innerHTML = `<option value="">Closed (weekend)</option>`;
        return;
      }

      timeField.disabled = false;
      timeField.innerHTML = `<option value="">Select a time</option>`;
      TIME_SLOTS.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        timeField.appendChild(opt);
      });
    }

    dateField.addEventListener("change", fillTimeSlots);
    fillTimeSlots();

    // -----------------------------------------------------
    // Scroll lock
    // -----------------------------------------------------
    function lockScroll() { document.body.classList.add("overlay-lock"); }
    function unlockScroll() { document.body.classList.remove("overlay-lock"); }

    // Close
    function hideOverlay() {
      unlockScroll();
      overlay.classList.remove("is-visible");
    }

    closeBtn.onclick = hideOverlay;
    closeIconBtn.onclick = hideOverlay;

    overlay.addEventListener("click", e => {
      if (e.target === overlay) hideOverlay();
    });

    // -----------------------------------------------------
    // Submit → WhatsApp
    // -----------------------------------------------------
    submitBtn.addEventListener("click", e => {
      e.preventDefault();

      const s      = serviceField.value.trim();
      const n      = nameField.value.trim();
      const eMail  = emailField.value.trim();
      const cCode  = countrySel.value;
      const local  = sanitizeLocalDigits(phoneField.value.trim());
      const d      = dateField.value;
      const t      = timeField.value;

      if (!s || !n || !eMail || !local || !d || !t) {
        alert("Please fill all required fields.");
        return;
      }

      // Country-based validation
      if (!isValidLocalNumber(cCode, local)) {
        alert("Please enter a valid phone number for the selected country.");
        return;
      }

      // Final full phone WITHOUT plus (for wa.me)
      const fullPhone = cCode.replace("+", "") + local;

      const formatted = new Date(d).toLocaleDateString("en-GB");

      const msg =
`Hello, I would like to book:
• Service: ${s}
• Name: ${n}
• Email: ${eMail}
• Phone: ${fullPhone}
• Date: ${formatted}
• Time: ${t}

(Offline version)
Thank you`;

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    });

    // -----------------------------------------------------
    // Global open function
    // -----------------------------------------------------
    window.apllOpenForm = function (serviceName) {
      console.log("[fallbackForm] Open request — service:", serviceName);

      serviceField.value = serviceName || "Service";
      nameField.value = "";
      emailField.value = "";
      phoneField.value = "";
      dateField.value = todayStr;

      fillTimeSlots();

      lockScroll();
      overlay.classList.add("is-visible");
    };

})();  // IIFE END
