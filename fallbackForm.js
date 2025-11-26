// =========================================================
// fallbackForm.js — GITHUB VERSION (Fullscreen, ENGLISH)
// White background • Same layout as reservation.js
// Fully self-contained (CSS + HTML + JS)
// =========================================================

(function () {

    console.log("✓ fallbackForm.js loaded (GITHUB version)");

    // Prevent duplicate injection
    if (document.querySelector("#apllFallbackOverlay")) return;

    // ============================================
    //  CSS  — identical layout to reservation.js
    // ============================================
    const style = document.createElement("style");
    style.textContent = `
    /* ===== FULLSCREEN OVERLAY ===== */
    #apllFallbackOverlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999999;
    }
    #apllFallbackOverlay.is-visible {
        display: flex;
    }

    /* ===== FORM BOX ===== */
    #apllFallbackBox {
        width: 90%;
        max-width: 380px;
        border-radius: 12px;
        padding: 20px;
        background: #ffffff;
        box-shadow: 0 8px 20px rgba(0,0,0,0.18);
        overflow: hidden;
        -webkit-overflow-scrolling: touch;
    }

    /* ===== HEADINGS ===== */
    #apllFallbackBox h2 {
        margin: 0 0 14px;
        font-size: 22px;
        font-weight: 700;
        text-align: center;
        color: #0A2E5C;
    }

    /* ===== LABELS ===== */
    #apllFallbackBox label {
        display: block;
        margin: 6px 0 3px;
        font-size: 0.85rem;
        font-weight: 600;
        color: #1a1d20;
    }

    /* ===== INPUTS ===== */
    #apllFallbackBox input,
    #apllFallbackBox select {
        width: 100%;
        padding: 8px 10px;
        border-radius: 6px;
        border: 1px solid #d0d4dc;
        font-size: 16px;
        box-sizing: border-box;
    }

    /* Date input */
    #apllFallbackBox input[type="date"] {
        appearance: none;
        -webkit-appearance: none;
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        border-radius: 6px;
    }

    /* ===== BUTTONS ===== */
    #apllFallbackBox .btn {
        width: 100%;
        padding: 10px;
        border-radius: 8px;
        margin-top: 10px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        border: none;
        transition: 0.15s;
    }

    #apllFallbackSubmit {
        background: #0B5ED7;
        color: #fff;
        box-shadow: 0 3px 10px rgba(11,94,215,0.25);
    }
    #apllFallbackSubmit:hover {
        filter: brightness(0.95);
    }

    #apllFallbackClose {
        background: #fff;
        color: #0A2E5C;
        border: 1px solid #d0d4dc;
    }

    /* ===== MOBILE ===== */
    @media (max-width: 600px) {
        #apllFallbackBox {
            max-width: 95%;
            padding: 16px;
        }
    }
    `;
    document.head.appendChild(style);

    // ============================================
    //  HTML TEMPLATE
    // ============================================
    const overlay = document.createElement("div");
    overlay.id = "apllFallbackOverlay";
    overlay.innerHTML = `
        <div id="apllFallbackBox">
            <form id="apllFallbackForm">
                <h2>Book an Appointment</h2>

                <label for="apllFbService">Service</label>
                <input id="apllFbService" type="text" readonly />

                <label for="apllFbName">Name</label>
                <input id="apllFbName" type="text" placeholder="Your name" required />

                <label for="apllFbPhone">Phone</label>
                <input id="apllFbPhone" type="tel" placeholder="Your phone number" required />

                <label for="apllFbDate">Date</label>
                <input id="apllFbDate" type="date" required />

                <label for="apllFbTime">Time</label>
                <select id="apllFbTime" required>
                    <option value="">Select a time</option>
                </select>

                <button id="apllFallbackSubmit" class="btn" type="submit">Send via WhatsApp</button>
                <button id="apllFallbackClose" class="btn" type="button">Close</button>
            </form>
        </div>
    `;
    document.body.appendChild(overlay);

    // ============================================
    //  JS LOGIC
    // ============================================

    const WHATSAPP_NUMBER = "393318358086";
    const TIME_SLOTS = [
        "09:00","09:30","10:00","10:30",
        "11:00","11:30","15:00","15:30",
        "16:00","16:30","17:00","17:30"
    ];

    // Fields
    const serviceField = overlay.querySelector("#apllFbService");
    const nameField    = overlay.querySelector("#apllFbName");
    const phoneField   = overlay.querySelector("#apllFbPhone");
    const dateField    = overlay.querySelector("#apllFbDate");
    const timeField    = overlay.querySelector("#apllFbTime");

    const submitBtn    = overlay.querySelector("#apllFallbackSubmit");
    const closeBtn     = overlay.querySelector("#apllFallbackClose");

    // Date rules
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);

    const toInput = d => d.toISOString().split("T")[0];

    dateField.min = toInput(today);
    dateField.max = toInput(maxDate);
    dateField.value = toInput(today);

    function isClosedDay(date) {
        const d = date.getDay();
        return d === 0 || d === 6;
    }

    dateField.addEventListener("change", () => {
        const d = new Date(dateField.value + "T00:00");
        timeField.innerHTML = "";

        if (isClosedDay(d)) {
            timeField.innerHTML = `<option value="">Closed</option>`;
            return;
        }
        timeField.innerHTML = `<option value="">Select a time</option>`;
        TIME_SLOTS.forEach(t => timeField.innerHTML += `<option>${t}</option>`);
    });

    // ============================================
    // API FOR loadForm.js → OPEN THE FORM
    // ============================================
    window.openFallbackForm = function (serviceName) {
        serviceField.value = serviceName || "Service";
        nameField.value = "";
        phoneField.value = "";
        timeField.innerHTML = `<option value="">Select a time</option>`;
        overlay.classList.add("is-visible");
    };

    // Close
    closeBtn.onclick = () => overlay.classList.remove("is-visible");

    // WhatsApp submit
    submitBtn.addEventListener("click", e => {
        e.preventDefault();

        const service = serviceField.value.trim();
        const name    = nameField.value.trim();
        const phone   = phoneField.value.trim();
        const date    = dateField.value;
        const time    = timeField.value;

        if (!service || !name || !phone || !date || !time) {
            alert("Please fill all fields.");
            return;
        }

        const formatted = new Date(date).toLocaleDateString("en-US");

        const msg =
`Hello, I would like to book:
• Service: ${service}
• Name: ${name}
• Phone: ${phone}
• Date: ${formatted}
• Time: ${time}

Thank you`;

        const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
        window.open(link, "_blank");
    });

})();
