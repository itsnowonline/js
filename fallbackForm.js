/* =========================================================
   fallbackForm.js — OFFLINE FORM (Premium UI - No CSS)
   - ID-safe version
   - No conflict with advancedForm.js
   - No CSS (will use /css/allform.css later)
   - Global open function: window.apllOpenFallbackForm()
   ========================================================= */

console.log("[fallbackForm] Loaded — ID safe version");

(function () {

    /* Prevent duplicate inject */
    if (document.querySelector("#fallbackFormOverlay")) return;

    /* -----------------------------------------------------
       HTML (same structure as advancedForm.js but IDs unique)
    ----------------------------------------------------- */

    const overlay = document.createElement("div");
    overlay.id = "fallbackFormOverlay";

    overlay.innerHTML = `
      <div id="fallbackFormBox" role="dialog" aria-modal="true">
        <button id="fallbackCloseIcon" type="button">×</button>

        <div id="fallbackFormChip">
          <span id="fallbackChipDot"></span>
          <span>Offline booking</span>
        </div>

        <h2>Book an Appointment</h2>
        <p id="fallbackSubtitle">This offline mode still works with WhatsApp.</p>

        <form id="fallbackForm">

          <label for="fallbackService">Service</label>
          <input id="fallbackService" type="text" readonly autocomplete="off" />

          <label for="fallbackName">Name</label>
          <input id="fallbackName" type="text" placeholder="Your name"
                 autocomplete="name" required />

          <label for="fallbackPhone">Phone</label>
          <input id="fallbackPhone" type="tel" placeholder="Your phone number"
                 autocomplete="tel" inputmode="tel" required />

          <label for="fallbackDate">Date</label>
          <input id="fallbackDate" type="date" required autocomplete="off" />

          <label for="fallbackTime">Time</label>
          <select id="fallbackTime" required>
            <option value="">Select a time</option>
          </select>

          <button id="fallbackSubmit" type="submit">Send via WhatsApp</button>
          <button id="fallbackClose" type="button">Close</button>

        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    /* -----------------------------------------------------
       JS LOGIC (same as advancedForm.js)
    ----------------------------------------------------- */

    const WHATSAPP = "393318358086";
    const TIME_SLOTS = [
      "09:00","09:30","10:00","10:30",
      "11:00","11:30","15:00","15:30",
      "16:00","16:30","17:00","17:30"
    ];

    const serviceField = overlay.querySelector("#fallbackService");
    const nameField    = overlay.querySelector("#fallbackName");
    const phoneField   = overlay.querySelector("#fallbackPhone");
    const dateField    = overlay.querySelector("#fallbackDate");
    const timeField    = overlay.querySelector("#fallbackTime");

    const submitBtn    = overlay.querySelector("#fallbackSubmit");
    const closeBtn     = overlay.querySelector("#fallbackClose");
    const closeIconBtn = overlay.querySelector("#fallbackCloseIcon");

    /* Setup dates */
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);

    const toInput = d => d.toISOString().split("T")[0];

    const todayStr = toInput(today);
    dateField.min = todayStr;
    dateField.max = toInput(maxDate);
    dateField.value = todayStr;

    function isClosedDate(d) {
      const day = d.getDay();
      return (day === 0 || day === 6);
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

    /* Scroll lock */
    function lockScroll() { document.body.classList.add("overlay-lock"); }
    function unlockScroll() { document.body.classList.remove("overlay-lock"); }

    /* Close handlers */
    function hideOverlay() {
      unlockScroll();
      overlay.classList.remove("is-visible");
    }

    closeBtn.onclick = hideOverlay;
    closeIconBtn.onclick = hideOverlay;

    overlay.addEventListener("click", e => {
      if (e.target === overlay) hideOverlay();
    });

    /* WhatsApp sending */
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

(Offline form)
Thank you`;

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    });

    fillTimeSlots();

    /* -----------------------------------------------------
       Global open entry
    ----------------------------------------------------- */
    window.apllOpenFallbackForm = function (serviceName) {
      console.log("[fallbackForm] Opening fallback with:", serviceName);

      serviceField.value = serviceName || "Service";
      nameField.value = "";
      phoneField.value = "";
      dateField.value = todayStr;

      fillTimeSlots();

      lockScroll();
      overlay.classList.add("is-visible");
    };

})();
