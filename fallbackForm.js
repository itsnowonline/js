console.log("[fallbackForm] Loaded (OFFLINE PREMIUM VERSION)");

(function () {

    // avoid double
    if (document.querySelector("#fallbackFormOverlay")) return;

    /* -----------------------------------------------------
       HTML — same layout, different IDs (no clash)
    ----------------------------------------------------- */
    const overlay = document.createElement("div");
    overlay.id = "fallbackFormOverlay";
    overlay.innerHTML = `
      <div id="fallbackFormBox" role="dialog" aria-modal="true">

        <button id="fallbackCloseIcon" type="button">×</button>

        <div id="fallbackFormChip" class="apll-chip">
          <span id="fallbackFormChipDot" class="apll-chip-dot"></span>
          <span>Offline booking</span>
        </div>

        <h2>Easy WhatsApp Booking</h2>
        <p id="fallbackFormSubtitle">
          Server is offline now — but you can still book via WhatsApp.
        </p>

        <form id="fallbackForm">
          <label for="fallbackService">Service</label>
          <input id="fallbackService" type="text" readonly autocomplete="off" />

          <label for="fallbackName">Name</label>
          <input id="fallbackName" type="text" placeholder="Your name"
                 autocomplete="name" required />

          <label for="fallbackPhone">Phone</label>
          <input id="fallbackPhone" type="tel" placeholder="Your phone number"
                 inputmode="tel" autocomplete="tel" required />

          <label for="fallbackDate">Date</label>
          <input id="fallbackDate" type="date" required autocomplete="off" />

          <label for="fallbackTime">Time</label>
          <select id="fallbackTime" required>
            <option value="">Select a time</option>
          </select>

          <button id="fallbackSubmit" type="submit">
            <span>Send via WhatsApp</span>
          </button>

          <button id="fallbackClose" type="button">
            <span>Close</span>
          </button>
        </form>

      </div>
    `;

    document.body.appendChild(overlay);

    /* -----------------------------------------------------
       MAP fallback IDs → advanced CSS classes
       (so same CSS applies directly)
    ----------------------------------------------------- */

    // Map fallback IDs → advanced CSS IDs
    const map = {
      "fallbackFormBox":   "apllFormBox",
      "fallbackFormChip":  "apllFormChip",
      "fallbackFormChipDot": "apllFormChipDot",
      "fallbackFormSubtitle": "apllFormSubtitle",
      "fallbackCloseIcon": "apllCloseIcon",
      "fallbackSubmit":     "apllSubmit",
      "fallbackClose":      "apllClose",
      "fallbackTime":       "apllTime"
    };

    for (const src in map) {
      const elm = overlay.querySelector("#" + src);
      if (elm) elm.id = map[src];  // rename to match CSS
    }

    // Rename main overlay to use same CSS
    overlay.id = "apllFormOverlay";

    /* -----------------------------------------------------
       JS LOGIC (same as advanced, offline wording)
    ----------------------------------------------------- */

    const WHATSAPP = "393318358086";
    const TIME_SLOTS = [
      "09:00","09:30","10:00","10:30",
      "11:00","11:30","15:00","15:30",
      "16:00","16:30","17:00","17:30"
    ];

    const serviceField = overlay.querySelector("#fallbackService") || overlay.querySelector("#apllService");
    const nameField    = overlay.querySelector("#fallbackName");
    const phoneField   = overlay.querySelector("#fallbackPhone");
    const dateField    = overlay.querySelector("#fallbackDate");
    const timeField    = overlay.querySelector("#apllTime");

    const submitBtn    = overlay.querySelector("#apllSubmit");
    const closeBtn     = overlay.querySelector("#apllClose");
    const closeIconBtn = overlay.querySelector("#apllCloseIcon");

    // Dates
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);

    const toInput = d => d.toISOString().split("T")[0];
    const todayStr = toInput(today);

    dateField.min = todayStr;
    dateField.max = toInput(maxDate);
    dateField.value = todayStr;

    function isClosedDay(d) {
      const day = d.getDay();
      return day === 0 || day === 6;
    }

    function fillSlots() {
      const d = new Date(dateField.value + "T00:00");
      timeField.innerHTML = "";

      if (isClosedDay(d)) {
        timeField.classList.add("apll-closed");
        timeField.disabled = true;
        timeField.innerHTML = `<option value="">Closed (weekend)</option>`;
        return;
      }

      timeField.classList.remove("apll-closed");
      timeField.disabled = false;
      timeField.innerHTML = `<option value="">Select a time</option>`;
      TIME_SLOTS.forEach(t => {
        const o = document.createElement("option");
        o.value = t;
        o.textContent = t;
        timeField.appendChild(o);
      });
    }

    dateField.addEventListener("change", fillSlots);
    fillSlots();

    /* SCROLL LOCK */
    function lockScroll() {
      document.body.classList.add("overlay-lock");
    }
    function unlockScroll() {
      document.body.classList.remove("overlay-lock");
    }

    function hideOverlay() {
      unlockScroll();
      overlay.classList.remove("is-visible");
    }

    closeBtn.onclick = hideOverlay;
    closeIconBtn.onclick = hideOverlay;

    overlay.addEventListener("click", e => {
      if (e.target === overlay) hideOverlay();
    });

    /* SEND WHATSAPP */
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
`Hello, I want to book (offline mode):
• Service: ${service}
• Name: ${name}
• Phone: ${phone}
• Date: ${formatted}
• Time: ${time}

Thank you`;

      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    });

    /* GLOBAL OPEN FUNCTION */
    window.apllOpenFallbackForm = function (serviceName) {
      console.log("[fallbackForm] Opening fallback form…");

      serviceField.value = serviceName || "Service";
      nameField.value = "";
      phoneField.value = "";
      dateField.value = todayStr;

      fillSlots();
      lockScroll();
      overlay.classList.add("is-visible");
    };

})();
