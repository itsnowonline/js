// ============================================================
//  MENU NAVIGATION + Trigger 2 (Bottom Overscroll Tutorial)
// ============================================================

import * as pages from "./menuPages.js";
import { hookMenuTutorialTrigger } from "./menuPages.js";

// ============================================================
//  Tutorial Cooldown System (Shared Across All Triggers)
// ============================================================
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


// ============================================================
//  PAGE RENDER SYSTEM
// ============================================================
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


// ============================================================
//  LEFT–RIGHT MENU PAGE SWIPES
// ============================================================
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


// ============================================================
//  LEFT–RIGHT SWIPE DETECTION
// ============================================================
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

    // vertical swipes ignore
    if (Math.abs(dy) > Math.abs(dx)) return;

    // small swipe ignore
    if (Math.abs(dx) < 40) return;

    if (dx > 0) prevPage();
    else nextPage();
});


// ============================================================
//  ⭐ TRIGGER 2 — Bottom Overscroll Swipe → Tutorial
//  (Scroll container = #app, not window)
// ============================================================
let overscrollLocked = false;

window.addEventListener("touchend", () => {
    if (!app) return;

    const scrollTop = app.scrollTop;
    const visible = app.clientHeight;
    const total = app.scrollHeight;

    const atBottom = scrollTop + visible >= total - 2;
    if (!atBottom) return;

    if (overscrollLocked) return;
    overscrollLocked = true;
    setTimeout(() => (overscrollLocked = false), 350);

    if (canRunTutorial()) {
        startSwipeTutorial();
        markTutorialRun();
    }
});


// ============================================================
//  BUTTON CLICKS — MENU, HOME, ETC.
// ============================================================
function attachNavClicks() {

    // HOME buttons
    document.querySelectorAll(".home-btn").forEach(btn => {
        btn.onclick = () => render(0);
    });

    // MENU button (visual navigation only)
    document.querySelectorAll(".nav-link").forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === "menu") {
            btn.onclick = () => render(1);
        }
    });
}


// ============================================================
//  ⭐ TRIGGER 3 — MENU click Tutorial Hook Activation
// ============================================================
hookMenuTutorialTrigger();


// ========================================================
//   SIMPLE FLOATING FINGER SWIPE (3 REPEATS)
//   Right → Left (-50px → +50px)
//   Used as: startSwipeTutorial()
// ========================================================
export function startSwipeTutorial() {

    // Prevent double-running
    if (document.getElementById("fingerSwipeTutor")) return;

    const finger = document.createElement("img");
    finger.id = "fingerSwipeTutor";
    finger.src = "https://itsnowonline.github.io/js/swipe/finger.png";

    Object.assign(finger.style, {
        position: "fixed",
        bottom: "40%",
        left: "-50px",
        width: "120px",
        height: "120px",
        opacity: "1",
        zIndex: "999999",
        pointerEvents: "none",
        transform: "translateX(0)",
        transition: "transform 1s ease"
    });

    document.body.appendChild(finger);

    let swipeCount = 0;

    function doSwipe() {
        swipeCount++;

        requestAnimationFrame(() => {
            finger.style.transform = "translateX(300px)";
        });

        setTimeout(() => {
            finger.style.transition = "none";
            finger.style.transform = "translateX(0)";
            finger.offsetHeight; // reflow

            finger.style.transition = "transform 1s ease";

            if (swipeCount < 3) {
                setTimeout(doSwipe, 200);
            } else {
                finger.style.transition = "opacity 0.4s ease";
                finger.style.opacity = "0";
                setTimeout(() => finger.remove(), 400);
            }
        }, 1000);
    }

    doSwipe();
}
