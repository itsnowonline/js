/* =========================================================
   fallbackForm.js — OFFLINE FORM (Premium UI)
   - Same UI / behaviour as advancedForm.js
   - Separate root overlay: #fallbackFormOverlay
   - Exposes: window.apllOpenForm(serviceName)
   ========================================================= */

console.log("[fallbackForm] Loaded (OFFLINE PREMIUM VERSION)");

(function () {

    // Avoid duplicates
    if (document.querySelector("#fallbackFormOverlay")) return;

    // -----------------------------------------------------
    // CSS — Premium UI + Animations (same as advanced, new overlay id)
    // -----------------------------------------------------
    const css = document.createElement("style");
    css.textContent = `
      /* ===== OVERLAY (fullscreen, animated) ===== */
      #fallbackFormOverlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(10, 16, 35, 0.70);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 999999;

        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 220ms ease, visibility 220ms ease;
      }
      #fallbackFormOverlay.is-visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      /* ===== FORM BOX (card, gradient, animated) ===== */
      #apllFormBox {
        position: relative;
        width: 92%;
        max-width: 420px;
        border-radius: 18px;
        padding: 20px 18px 18px;
        background: radial-gradient(120% 180% at 0% 0%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 45%, rgba(245,248,255,0.96) 100%),
                    linear-gradient(180deg, #f5f8ff 0%, #dbe4f6 40%, #bfcde8 100%);
        box-shadow:
          0 18px 45px rgba(0, 0, 0, 0.30),
          0 0 0 1px rgba(255,255,255,0.45);
        overflow: hidden;
        -webkit-overflow-scrolling: touch;

        transform: translateY(14px) scale(0.96);
        opacity: 0;
        transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
                    opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      #fallbackFormOverlay.is-visible #apllFormBox {
        transform: translateY(0) scale(1);
        opacity: 1;
      }

      /* Reduce motion (accessibility) */
      @media (prefers-reduced-motion: reduce) {
        #fallbackFormOverlay,
        #apllFormBox {
          transition: none !important;
        }
      }

      /* ===== TOP "HANDLE" / LABEL ===== */
      #apllFormChip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 999px;
        background: rgba(10, 46, 92, 0.06);
        color: #0A2E5C;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .03em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      #apllFormChipDot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 0 4px rgba(34,197,94,0.25);
      }

      /* ===== HEADING & SUBTEXT ===== */
      #apllFormBox h2 {
        margin: 3px 0 4px;
        font-size: 22px;
        font-weight: 750;
        letter-spacing: .02em;
        color: #0A2E5C;
      }
      #apllFormSubtitle {
        font-size: 13px;
        margin: 0 0 14px;
        color: #4c5564;
      }

      /* ===== CLOSE ICON (floating) ===== */
      #apllCloseIcon {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 999px;
        border: none;
        background: rgba(255,255,255,0.9);
        box-shadow: 0 2px 8px rgba(15,23,42,0.20);
        color: #111827;
        font-size: 18px;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
      }
      #apllCloseIcon:hover {
        transform: translateY(-1px);
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(15,23,42,0.26);
      }
      #apllCloseIcon:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(15,23,42,0.18);
      }

      /* ===== FORM LAYOUT ===== */
      #apllForm {
        margin-top: 4px;
      }
      #apllForm label {
        display: block;
        margin: 7px 0 3px;
        font-size: 12px;
        font-weight: 600;
        color: #1f2933;
      }
      #apllForm small {
        font-size: 11px;
        color: #6b7280;
      }

      #apllForm input,
      #apllForm select {
        width: 100%;
        padding: 9px 11px;
        border-radius: 9px;
        border: 1px solid #c8ced8;
        font-size: 16px !important;
        box-sizing: border-box;
        background: rgba(255,255,255,0.96);
        transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
      }
      #apllForm input:focus,
      #apllForm select:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.40);
        background: #ffffff;
      }
      #apllForm input[type="date"] {
        appearance: none;
        -webkit-appearance: none;
        height: 40px;
      }

      /* ===== TIME SELECT WHEN CLOSED ===== */
      #apllTime.apll-closed {
        background: #f3f4f6 !important;
        color: #9ca3af;
        cursor: not-allowed;
      }

      /* ===== BUTTONS ===== */
      #apllSubmit,
      #apllClose {
        width: 100%;
        padding: 11px 14px;
        margin-top: 10px;
        border-radius: 999px;
        font-size: 15px;
        font-weight: 700;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: transform 80ms ease, box-shadow 120ms ease, filter 120ms ease, background-color 120ms ease;
      }

      #apllSubmit {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #ffffff;
        box-shadow: 0 7px 18px rgba(37, 99, 235, 0.38);
      }
      #apllSubmit:hover {
        filter: brightness(0.97);
        box-shadow: 0 9px 22px rgba(37, 99, 235, 0.45);
        transform: translateY(-1px);
      }
      #apllSubmit:active {
        transform: translateY(0);
        box-shadow: 0 3px 10px rgba(37, 99, 235, 0.35);
      }

      #apllClose {
        background: rgba(255,255,255,0.9);
        color: #0f172a;
        border: 1px solid rgba(148,163,184,0.7);
        box-shadow: 0 3px 8px rgba(15,23,42,0.16);
      }
      #apllClose:hover {
        background: #ffffff;
        box-shadow: 0 5px 12px rgba(15,23,42,0.22);
        transform: translateY(-1px);
      }
      #apllClose:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(15,23,42,0.18);
      }

      /* Mobile tweaks */
      @media (max-width: 480px) {
        #apllFormBox {
          padding: 18px 14px 16px;
          border-radius: 16px;
        }
        #apllFormBox h2 {
          font-size: 20px;
        }
      }
    `;
    document.head.appendChild(css);

    // -----------------------------------------------------
    // HTML — Premium layout (same structure as advanced)
    // -----------------------------------------------------
    const overlay = document.createElement("div");
    overlay.id = "fallbackFormOverlay";
    overlay.innerHTML = `
      <div id="apllFormBox" role="dialog" aria-modal="true" aria-label="Book an appointment">
        <button id="apllCloseIcon" type="button" aria-label="Close form">×</button>

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

          <label for="apllPhone">Phone</label>
          <input id="apllPhone" type="tel" placeholder="Your phone number"
                 inputmode="tel" autocomplete="tel" required />

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
    // JS LOGIC — same as advancedForm.js
    // -----------------------------------------------------
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

    const submitBtn    = overlay.querySelector("#apllSubmit");
    const closeBtn     = overlay.querySelector("#apllClose");
    const closeIconBtn = overlay.querySelector("#apllCloseIcon");

    // Date setup
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
      return day === 0 || day === 6; // Sun & Sat closed
    }

    function fillTimeSlotsForCurrentDate() {
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

    dateField.addEventListener("change", fillTimeSlotsForCurrentDate);

    // Scroll lock (reuses same body class)
    function lockScroll() {
      document.body.classList.add("overlay-lock");
    }
    function unlockScroll() {
      document.body.classList.remove("overlay-lock");
    }

    // Close logic
    function hideOverlay() {
      unlockScroll();
      overlay.classList.remove("is-visible");
    }

    closeBtn.onclick = hideOverlay;
    closeIconBtn.onclick = hideOverlay;

    overlay.addEventListener("click", e => {
      if (e.target === overlay) hideOverlay();
    });

    // Submit → WhatsApp
    submitBtn.addEventListener("click", e => {
      e.preventDefault();

      const service = serviceField.value.trim();
      const name    = nameField.value.trim();
      const phone   = phoneField.value.trim();
      const date    = dateField.value;
      const time    = timeField.value;

      if (!service || !name || !phone || !date || !time || timeField.disabled) {
        alert("Please fill all fields and select a valid working day.");
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

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    });

    // Initialize today’s slots
    fillTimeSlotsForCurrentDate();

    // -----------------------------------------------------
    // Global entry for loadForm.js — SAME NAME as advanced
    // -----------------------------------------------------
    window.apllOpenForm = function (serviceName) {
      console.log("[fallbackForm] Open request — service:", serviceName);

      serviceField.value = serviceName || "Service";
      nameField.value = "";
      phoneField.value = "";
      dateField.value = todayStr;

      fillTimeSlotsForCurrentDate();

      lockScroll();
      overlay.classList.add("is-visible");
    };

})(); // IIFE end
