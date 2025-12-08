// =============================================
//  MENU NAVIGATION + Trigger 2 (Overscroll)
// =============================================

import * as pages from "./menuPages.js";
import { startSwipeTutorial } from "https://itsnowonline.github.io/js/swipe/swipe.js";

// -------------------------------
// Tutorial Cooldown System
// -------------------------------
const LS_KEY = "harrys_swipe_last_run";
const COOLDOWN_MS = 180 * 60 * 1000; // 180 minutes

function canRunTutorial() {
    const last = localStorage.getItem(LS_KEY);
    if (!last) return true;
    return (Date.now() - Number(last)) >= COOLDOWN_MS;
}

function markTutorialRun() {
    localStorage.setItem(LS_KEY, Date.now().toString());
}


// -------------------------------
// Page Rendering System
// -------------------------------
const page0HTML = pages.page0HTML;
const page1HTML = pages.page1HTML;
const page2HTML = pages.page2HTML;
const page3HTML = pages.page3HTML;
const page4HTML = pages.page4HTML;
const page5HTML = pages.page5HTML;

const app = document.getElementById("app");

let currentPage = 0;

function render(page) {
    currentPage = page;

    if (page === 0) {
        app.innerHTML = page0HTML;
        app.className = "homeMode";
        attachNavClicks();
        return;
    }

    app.className = "menuMode";
    app.style.opacity = 0;

    const html =
        page === 1 ? page1HTML :
        page === 2 ? page2HTML :
        page === 3 ? page3HTML :
        page === 4 ? page4HTML :
        page5HTML;

    setTimeout(() => {
        app.innerHTML = html;
        app.style.opacity = 1;
        attachNavClicks();
    }, 10);
}


// -------------------------------
// Left ↔ Right Page Swipes
// -------------------------------
function nextPage() {
    if (currentPage === 0) render(1);
    else if (currentPage === 1) render(2);
    else if (currentPage === 2) render(3);
    else if (currentPage === 3) render(4);
    else if (currentPage === 4) render(5);
}

function prevPage() {
    if (currentPage === 5) render(4);
    else if (currentPage === 4) render(3);
    else if (currentPage === 3) render(2);
    else if (currentPage === 2) render(1);
    else if (currentPage === 1) render(0);
}

render(0);


// -------------------------------
// Horizontal Swipe Detection
// -------------------------------
let sx = 0;
let sy = 0;

document.addEventListener("touchstart", e => {
    const t = e.changedTouches[0];
    sx = t.clientX;
    sy = t.clientY;
});

document.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;

    // Ignore vertical swipes
    if (Math.abs(dy) > Math.abs(dx)) return;

    if (Math.abs(dx) < 40) return;

    if (dx > 0) prevPage();
    else nextPage();
});


// ================================
// ⭐ Trigger 2 — Bottom Overscroll
// ================================
let overscrollLocked = false;

window.addEventListener("touchend", () => {
    const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

    if (!atBottom) return;

    if (overscrollLocked) return; // prevent double fire in same position
    overscrollLocked = true;
    setTimeout(() => overscrollLocked = false, 400); // small unlock delay

    if (canRunTutorial()) {
        startSwipeTutorial();
        markTutorialRun();
    }
});


// -------------------------------
// Menu & Home Button Click Logic
// -------------------------------
function attachNavClicks() {

    // Home buttons
    document.querySelectorAll(".home-btn").forEach(btn => {
        btn.onclick = () => render(0);
    });

    // Menu button (Trigger 3 handled in menuPages.js)
    document.querySelectorAll(".nav-link").forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === "menu") {
            btn.onclick = () => render(1);
        }
    });
}
