/* =========================================================
   fallbackForm.js — OFFLINE FORM (Premium UI)
   - Uses EXACT SAME IDs as advancedForm.js
   - Uses same CSS (/css/allform.css)
   - Fully compatible with loadForm.js
   - Global entry: window.apllOpenFallbackForm(serviceName)
========================================================= */

console.log("[fallbackForm] Loaded (OFFLINE VERSION)");

(function () {

    // Prevent duplicates
    if (document.querySelector("#apllFormOverlay")) return;

    /* ----------------------------------------------------
       HTML — EXACT SAME MARKUP AS advancedForm (IMPORTANT)
    ---------------------------------------------------- */

    const overlay = document.createElement("div");
    overlay.id = "apllFormOverlay"; // <— SAME ID
    overlay.innerHTML = `
      <div id="apllFormBox" role="dialog" aria-modal="true">
        <button id="apllCloseIcon" type="button">×</button>

        <div id="apllFormChip">
          <span id="apllFormChipDot"></span>
          <span>Offline booking</span>
        </div>

        <h2>Book an Appointment</h2>
        <p id="apllFormSubtitle">
          Server offline — but WhatsApp booking still works normally.
        </p>

        <form id="apllForm">

          <label for="apllService">Service</label>
          <input id="apllService" type="text" readonly autocomplete="off" />

          <label for="apllName">Name</label>
          <input id="apllName" type="text" placeholder="Your name"
                 autocomplete="name" required />

          <label for="apllPhone">Phone</label>
          <input id="apllPhone" type="tel" placeholder="Your phone number"
                 inputmode="tel" autocomplete="tel" required />

          <label for="apllDate">Date</label>
          <input id="apllDate" type="date" required autocomplete="off" />

          <label for="apllTime">Time</label>
          <select id="apllTime" required>
            <option value="">Select a time</option>
          </select>

          <button id="apllSubmit" type="submit">Send via WhatsApp</button>
          <button id="apllClose" type="button">Close</button>

        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    /* ----------------------------------------------------
       JS LOGIC — SAME AS advancedForm.js
    ---------------------------------------------------- */

    const WHATSAPP = "393318358086";

    const TIME_SLOTS = [
      "09:00","09:30","10:00","10:30",
      "11:00","11:30","15:00","15:30",
      "16:00","16:30","17:00","17:30"
    ];

    const serviceField = overlay.querySelector("#apllService");
    const nameField    = overlay.querySelector("#apllName");
    const phoneField   = overlay.querySelector("#apllPhone");
    const dateField    = overlay.querySelector("#apllDate");
    const timeField    = overlay.querySelector("#apllTime");

    const closeBtn     = overlay.querySelector("#apllClose");
    const closeIconBtn = overlay.querySelector("#apllCloseIcon");
    const submitBtn    = overlay.querySelector("#apllSubmit");

    /* Date setup */
    const today   = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);

    const toInput = d => d.toISOString().split("T")[0];
    const todayStr = toInput(today);

    dateField.min = todayStr;
    dateField.max = toInput(maxDate);
    dateField.value = todayStr;

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

    /* Scroll lock */
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

    /* WhatsApp send */
    submitBtn.addEventListener("click", e => {
      e.preventDefault();

      const service = serviceField.value.trim();
      const name    = nameField.value.trim();
      const phone   = phoneField.value.trim();
      const date    = dateField.value;
      const time    = timeField.value;

      if (!service || !name || !phone || !date || !time || timeField.disabled) {
        alert("Please fill all fields correctly.");
        return;
      }

      const formatted = new Date(date).toLocaleDateString("en-GB");

      const msg =
`Hello, I would like to book:
• Service: ${service}
• Name: ${name}
• Phone: ${phone}
• Date: ${formatted}
• Time: ${time}

(Offline version)
Thank you`;

      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    });

    fillTimeSlots();

    /* ----------------------------------------------------
       GLOBAL FUNCTION (required by loadForm.js)
    ---------------------------------------------------- */
    window.apllOpenFallbackForm = function (serviceName) {
      console.log("[fallbackForm] Opening fallback form:", serviceName);

      serviceField.value = serviceName || "Service";
      nameField.value = "";
      phoneField.value = "";
      dateField.value = todayStr;

      fillTimeSlots();

      lockScroll();
      overlay.classList.add("is-visible");
    };

})();
