/* =========================================================
   fallbackForm.js — OFFLINE FORM (Premium UI)
   - Same UI as advancedForm.js
   - Uses /css/allform.css (NO inline CSS)
   - Fully compatible with loadForm.js
   - Chip text changed → “Easy WhatsApp booking”
   - Global: window.apllOpenForm()
   ========================================================= */

console.log("[fallbackForm] Loaded (OFFLINE VERSION)");

(function () {

    if (document.querySelector("#fallbackFormOverlay")) return;

    /* -----------------------------------------------------
       HTML — identical to advanced UI (only text changed)
    ----------------------------------------------------- */
    const overlay = document.createElement("div");
    overlay.id = "fallbackFormOverlay";
    overlay.className = "apll-overlay";  // uses same allform.css rules

    overlay.innerHTML = `
      <div id="apllFormBox" role="dialog" aria-modal="true">

        <button id="apllCloseIcon_f" type="button">×</button>

        <div id="apllFormChip">
          <span id="apllFormChipDot"></span>
          <span>Easy WhatsApp booking</span>
        </div>

        <h2>Book an Appointment</h2>
        <p id="apllFormSubtitle">
          Server is offline — but you can still book instantly via WhatsApp.
        </p>

        <form id="fallbackForm">

          <label for="apllService_f">Service</label>
          <input id="apllService_f" type="text" readonly autocomplete="off" />

          <label for="apllName_f">Name</label>
          <input id="apllName_f" type="text" placeholder="Your name"
                 autocomplete="name" required />

          <label for="apllPhone_f">Phone</label>
          <input id="apllPhone_f" type="tel" placeholder="Your phone number"
                 inputmode="tel" autocomplete="tel" required />

          <label for="apllDate_f">Date</label>
          <input id="apllDate_f" type="date" required autocomplete="off" />

          <label for="apllTime_f">Time</label>
          <select id="apllTime_f" required>
            <option value="">Select a time</option>
          </select>

          <button id="apllSubmit_f" type="submit">Send via WhatsApp</button>
          <button id="apllClose_f" type="button">Close</button>

        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    /* -----------------------------------------------------
       JS LOGIC — identical to advancedForm.js logic
    ----------------------------------------------------- */
    const WHATSAPP = "393318358086";
    const TIME_SLOTS = [
      "09:00","09:30","10:00","10:30",
      "11:00","11:30","15:00","15:30",
      "16:00","16:30","17:00","17:30"
    ];

    const serviceField = overlay.querySelector("#apllService_f");
    const nameField    = overlay.querySelector("#apllName_f");
    const phoneField   = overlay.querySelector("#apllPhone_f");
    const dateField    = overlay.querySelector("#apllDate_f");
    const timeField    = overlay.querySelector("#apllTime_f");

    const submitBtn    = overlay.querySelector("#apllSubmit_f");
    const closeBtn     = overlay.querySelector("#apllClose_f");
    const closeIconBtn = overlay.querySelector("#apllCloseIcon_f");

    /* Date Setup */
    const today = new Date();
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

    /* Close logic */
    function hideOverlay() {
      unlockScroll();
      overlay.classList.remove("is-visible");
    }

    closeBtn.onclick = hideOverlay;
    closeIconBtn.onclick = hideOverlay;
    overlay.addEventListener("click", e => { if (e.target === overlay) hideOverlay(); });

    /* WhatsApp Submit */
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

      const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      window.open(wa, "_blank");
    });

    fillTimeSlots();

    /* -----------------------------------------------------
       GLOBAL OPEN FUNCTION
       Same name as advanced → loadForm.js works perfectly
    ----------------------------------------------------- */
    window.apllOpenForm = function (serviceName) {
      console.log("[fallbackForm] Opening:", serviceName);

      serviceField.value = serviceName || "Service";
      nameField.value = "";
      phoneField.value = "";
      dateField.value = todayStr;

      fillTimeSlots();

      lockScroll();
      overlay.classList.add("is-visible");
    };

})(); 
