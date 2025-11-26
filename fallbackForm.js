/* =========================================================
   fallbackForm.js — OFFLINE FORM (Premium UI)
   - Same UI / behaviour as advancedForm.js
   - Separate overlay: #fallbackFormOverlay
   - Uses CSS from /css/allform.css
   - Uses window.APLL_COUNTRIES from countriesCode.js
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
    // Populate countries
    // -----------------------------------------------------
    function populateCountries() {
        if (!window.APLL_COUNTRIES) {
            console.error("APLL_COUNTRIES not loaded");
            return;
        }

        window.APLL_COUNTRIES.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.code;
            opt.textContent = `${c.flag} ${c.code}`;
            countrySel.appendChild(opt);
        });

        // Default Italy
        countrySel.value = "+39";
    }

    populateCountries();

    // Auto-remove spaces & hyphens
    phoneField.addEventListener("input", () => {
        phoneField.value = phoneField.value.replace(/[\s\-]+/g, "");
    });

    // If phone begins with +39xxxxx → set country automatically
    phoneField.addEventListener("blur", () => {
        const num = phoneField.value;

        if (num.startsWith("39")) countrySel.value = "+39";
        else if (num.startsWith("91")) countrySel.value = "+91";
        else if (num.startsWith("92")) countrySel.value = "+92";
        else if (num.startsWith("1"))  countrySel.value = "+1";
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

      const s = serviceField.value.trim();
      const n = nameField.value.trim();
      const eMail = emailField.value.trim();
      const cCode = countrySel.value;
      const p = phoneField.value.trim();
      const d = dateField.value;
      const t = timeField.value;

      if (!s || !n || !eMail || !p || !d || !t) {
        alert("Please fill all required fields.");
        return;
      }

      const fullPhone = cCode.replace("+", "") + p;
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
