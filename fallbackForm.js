/* =========================================================
   fallbackForm.js — OFFLINE FORM (Premium UI)
   Adds:
   ✔ Country selector (35%)
   ✔ Phone input (65%)
   ✔ Email field
   ✔ Auto-detect +39
   ========================================================= */

console.log("[fallbackForm] Loaded (OFFLINE PREMIUM VERSION)");

(function () {

    if (document.querySelector("#fallbackFormOverlay")) return;

    /* -----------------------------------------------------
       LOAD CSS
    ----------------------------------------------------- */
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/allform.css";
    document.head.appendChild(link);

    /* -----------------------------------------------------
       HTML
    ----------------------------------------------------- */
    const overlay = document.createElement("div");
    overlay.id = "fallbackFormOverlay";
    overlay.innerHTML = `
      <div id="apllFormBox" role="dialog" aria-modal="true">
        <button id="apllCloseIcon" type="button">×</button>

        <div id="apllFormChip">
          <span id="apllFormChipDot"></span>
          <span>Easy WhatsApp booking</span>
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
            <select id="apllCountry" class="apll-inline-select" required></select>
            <input id="apllPhone" type="tel" placeholder="Your number"
                   inputmode="tel" autocomplete="tel" required />
          </div>

          <label for="apllDate">Date</label>
          <input id="apllDate" type="date" required autocomplete="off" />

          <label for="apllTime">Time</label>
          <select id="apllTime" required>
            <option value="">Select a time</option>
          </select>

          <button id="apllSubmit" type="submit"><span>Send via WhatsApp</span></button>
          <button id="apllClose" type="button"><span>Close</span></button>

        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    /* -----------------------------------------------------
       INLINE CSS (only for phone row, safe)
    ----------------------------------------------------- */
    const phoneCSS = document.createElement("style");
    phoneCSS.textContent = `
      .apll-phone-row {
        display: flex;
        gap: 8px;
        width: 100%;
      }
      #apllCountry {
        width: 35%;
        padding: 9px 11px;
        border-radius: 9px;
        border: 1px solid #c8ced8;
        font-size: 15px;
        background: rgba(255,255,255,0.96);
      }
      #apllPhone {
        width: 65%;
      }
    `;
    document.head.appendChild(phoneCSS);

    /* -----------------------------------------------------
       JS LOGIC
    ----------------------------------------------------- */

    const WHATSAPP = "393318358086";
    const TIME_SLOTS = [
      "09:00","09:30","10:00","10:30",
      "11:00","11:30","15:00","15:30",
      "16:00","16:30","17:00","17:30"
    ];

    const serviceField = overlay.querySelector("#apllService");
    const nameField    = overlay.querySelector("#apllName");
    const emailField   = overlay.querySelector("#apllEmail");
    const phoneField   = overlay.querySelector("#apllPhone");
    const countrySel   = overlay.querySelector("#apllCountry");
    const dateField    = overlay.querySelector("#apllDate");
    const timeField    = overlay.querySelector("#apllTime");

    const submitBtn    = overlay.querySelector("#apllSubmit");
    const closeBtn     = overlay.querySelector("#apllClose");
    const closeIconBtn = overlay.querySelector("#apllCloseIcon");

    /* -----------------------------------------------------
       COUNTRY LIST SETUP
    ----------------------------------------------------- */

    function loadCountries() {
      if (!window.APLL_COUNTRIES) {
        console.error("countriesCode.js not loaded");
        countrySel.innerHTML = `<option value="+39">🇮🇹 +39</option>`;
        return;
      }

      countrySel.innerHTML = window.APLL_COUNTRIES
        .map(c => `<option value="${c.code}">${c.flag} ${c.code}</option>`)
        .join("");

      // Default Italy
      countrySel.value = "+39";
    }

    loadCountries();

    /* Phone sanitization */
    phoneField.addEventListener("input", () => {
      phoneField.value = phoneField.value.replace(/[^\d]/g, "");
    });

    /* -----------------------------------------------------
       DATE SETUP
    ----------------------------------------------------- */
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);
    const toInput = d => d.toISOString().split("T")[0];

    dateField.min = toInput(today);
    dateField.max = toInput(maxDate);
    dateField.value = toInput(today);

    function isClosedDate(d) {
      const day = d.getDay();
      return day === 0 || day === 6;
    }

    function fillTimeSlots() {
      const d = new Date(dateField.value + "T00:00");
      timeField.innerHTML = "";

      if (isClosedDate(d)) {
        timeField.classList.add("apll-closed");
        timeField.disabled = true;
        timeField.innerHTML = `<option value="">Closed (weekend)</option>`;
        return;
      }

      timeField.classList.remove("apll-closed");
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

    /* -----------------------------------------------------
       SCROLL LOCK
    ----------------------------------------------------- */
    function lockScroll() { document.body.classList.add("overlay-lock"); }
    function unlockScroll() { document.body.classList.remove("overlay-lock"); }

    function hideOverlay() {
      unlockScroll();
      overlay.classList.remove("is-visible");
    }

    closeBtn.onclick = hideOverlay;
    closeIconBtn.onclick = hideOverlay;
    overlay.addEventListener("click", e => {
      if (e.target === overlay) hideOverlay();
    });

    /* -----------------------------------------------------
       SUBMIT
    ----------------------------------------------------- */
    submitBtn.addEventListener("click", e => {
      e.preventDefault();

      const service = serviceField.value.trim();
      const name    = nameField.value.trim();
      const email   = emailField.value.trim();
      const phone   = phoneField.value.trim();
      const code    = countrySel.value;
      const date    = dateField.value;
      const time    = timeField.value;

      if (!service || !name || !email || !phone || !date || !time || timeField.disabled) {
        alert("Please fill all fields correctly.");
        return;
      }

      const fullPhone = code.replace("+","") + phone;

      const msg =
`Hello, I would like to book:
• Service: ${service}
• Name: ${name}
• Email: ${email}
• Phone: +${fullPhone}
• Date: ${new Date(date).toLocaleDateString("en-GB")}
• Time: ${time}

(Offline version)
Thank you`;

      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    });

    /* -----------------------------------------------------
       GLOBAL OPEN FUNCTION
    ----------------------------------------------------- */
    window.apllOpenForm = function (serviceName) {

      serviceField.value = serviceName || "Service";
      nameField.value = "";
      emailField.value = "";
      phoneField.value = "";
      countrySel.value = "+39";
      dateField.value = toInput(today);

      fillTimeSlots();
      lockScroll();
      overlay.classList.add("is-visible");
    };

})();
