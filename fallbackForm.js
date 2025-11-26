// ==============================
// fallbackForm.js — OFFLINE FORM (white background)
// Hosted at: https://itsnowonline.github.io/js/fallbackForm.js
// ==============================

console.log("[fallbackForm] Script loaded.");

const FBF_WHATSAPP_NUMBER = "393318358086";
const FBF_TIME_SLOTS = [
  "09:00","09:30","10:00","10:30",
  "11:00","11:30","15:00","15:30",
  "16:00","16:30","17:00","17:30"
];

function fbfIsClosedDay(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function fbfToInputDate(date) {
  return date.toISOString().split("T")[0];
}

function fbfCreateFormIfNeeded() {
  if (document.querySelector("#apllFormOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "apllFormOverlay";
  overlay.className = "reservation-overlay";
  overlay.innerHTML = `
    <div class="reservation-box">
      <form id="apllReservationForm">
        <h2>Prenota un Appuntamento</h2>

        <label for="apllService">Servizio</label>
        <input id="apllService" type="text" readonly />

        <label for="apllName">Nome</label>
        <input id="apllName" type="text" placeholder="Il tuo nome" required />

        <label for="apllPhone">Telefono</label>
        <input id="apllPhone" type="tel" placeholder="Il tuo numero" required />

        <label for="apllDate">Data</label>
        <input id="apllDate" type="date" required inputmode="none"
          style="-webkit-appearance:none; appearance:none;" />

        <label for="apllTime">Orario</label>
        <select id="apllTime" required>
          <option value="">Seleziona un orario</option>
        </select>

        <button id="apllWhatsAppBtn" class="btn btn-primary" type="submit">
          Invia su WhatsApp
        </button>
        <button id="apllCloseBtn" class="btn btn-outline" type="button">
          Chiudi
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const formContainer = overlay;
  const serviceField = overlay.querySelector("#apllService");
  const nameField = overlay.querySelector("#apllName");
  const phoneField = overlay.querySelector("#apllPhone");
  const dateField = overlay.querySelector("#apllDate");
  const timeField = overlay.querySelector("#apllTime");
  const whatsappBtn = overlay.querySelector("#apllWhatsAppBtn");
  const closeBtn = overlay.querySelector("#apllCloseBtn");

  // Date setup
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14);
  const todayStr = fbfToInputDate(today);
  dateField.min = todayStr;
  dateField.max = fbfToInputDate(maxDate);
  dateField.value = todayStr;

  // Prevent past date
  dateField.addEventListener("input", () => {
    const selected = new Date(dateField.value + "T00:00");
    const todayMid = new Date(todayStr + "T00:00");
    if (selected < todayMid) {
      dateField.value = todayStr;
    }
  });

  // Change date -> slots
  dateField.addEventListener("change", () => {
    const d = new Date(dateField.value + "T00:00");
    timeField.innerHTML = "";

    if (fbfIsClosedDay(d)) {
      timeField.innerHTML = `<option value="">Chiuso</option>`;
      return;
    }
    timeField.innerHTML = `<option value="">Seleziona un orario</option>`;
    FBF_TIME_SLOTS.forEach(t => {
      timeField.innerHTML += `<option value="${t}">${t}</option>`;
    });
  });

  // Close button
  closeBtn.addEventListener("click", () => {
    formContainer.classList.remove("is-visible");
  });

  // Click outside
  overlay.addEventListener("click", evt => {
    if (evt.target === overlay) {
      formContainer.classList.remove("is-visible");
    }
  });

  // WhatsApp send
  whatsappBtn.addEventListener("click", e => {
    e.preventDefault();

    const service = serviceField.value.trim();
    const name = nameField.value.trim();
    const phone = phoneField.value.trim();
    const date = dateField.value;
    const time = timeField.value;

    if (!service || !name || !phone || !date || !time) {
      alert("Riempi tutti i campi.");
      return;
    }

    const formatted = new Date(date).toLocaleDateString("it-IT");
    const msg =
      `Ciao, vorrei prenotare:%0A` +
      `• Servizio: ${service}%0A` +
      `• Nome: ${name}%0A` +
      `• Telefono: ${phone}%0A` +
      `• Data: ${formatted}%0A` +
      `• Orario: ${time}%0A%0AGrazie`;

    const link = `https://wa.me/${FBF_WHATSAPP_NUMBER}?text=${msg}`;
    window.open(`https://wa.me/${FBF_WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  });
}

// Global for loadForm.js
window.apllOpenForm = function (serviceName) {
  fbfCreateFormIfNeeded();

  const overlay = document.querySelector("#apllFormOverlay");
  if (!overlay) {
    console.error("[fallbackForm] Overlay not found.");
    return;
  }

  const serviceField = overlay.querySelector("#apllService");
  const nameField = overlay.querySelector("#apllName");
  const phoneField = overlay.querySelector("#apllPhone");
  const dateField = overlay.querySelector("#apllDate");
  const timeField = overlay.querySelector("#apllTime");

  serviceField.value = serviceName || "Servizio CAF";
  nameField.value = "";
  phoneField.value = "";
  timeField.innerHTML = `<option value="">Seleziona un orario</option>`;

  const today = new Date();
  const todayStr = fbfToInputDate(today);
  dateField.value = todayStr;

  overlay.classList.add("is-visible");
};
