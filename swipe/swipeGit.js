
// ============================================================
//   swipeGit.js — Floating Finger Swipe Animation (R → L)
//   • Max width 430px (or 90% of screen)
//   • 2 swipes
//   • Start slow, end fast (ease-in feel)
// ============================================================

export function startSwipeTutorial() {

    // If running already → stop
    if (document.getElementById("fingerSwipeWrap")) return;

    // ---------- WRAPPER ----------
    const wrap = document.createElement("div");
    wrap.id = "fingerSwipeWrap";
    Object.assign(wrap.style, {
        position: "fixed",
        bottom: "40%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "430px",
        height: "150px",
        pointerEvents: "none",
        zIndex: "999999",
        overflow: "visible"
    });
    document.body.appendChild(wrap);

    // ---------- FINGER IMAGE ----------
    const finger = document.createElement("img");
    finger.src = "https://itsnowonline.github.io/js/swipe/finger.png";

    Object.assign(finger.style, {
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "120px",
        height: "120px",
        transform: "translateX(0)",
        opacity: "1",
        transition: "none"
    });

    wrap.appendChild(finger);

    // ---------- ANIMATION SETTINGS ----------
    let count = 0;
    const totalSwipes = 2;          // Only 2 repeats
    const speed = 1400;             // Total duration
    const screenWidth = wrap.clientWidth;
    const fingerWidth = 120;
    const distance = screenWidth - fingerWidth; // full right → full left

    // ease-in: pehle slow, end me fast
    const easing = "cubic-bezier(0.55, 0.085, 0.68, 0.53)";

    // ---------- SWIPE FUNCTION ----------
    function swipe() {

        count++;

        // Start finger on full right
        finger.style.transition = "none";
        finger.style.transform = `translateX(${distance}px)`;
        finger.offsetHeight; // reflow force

        // Animate to full left (slow start, fast end)
        requestAnimationFrame(() => {
            finger.style.transition = `transform ${speed}ms ${easing}`;
            finger.style.transform = "translateX(0px)";
        });

        // Finish
        setTimeout(() => {

            if (count < totalSwipes) {
                // prepare next swipe with pause
                finger.style.transition = "none";
                setTimeout(swipe, 400);
            } else {
                // LAST SWIPE → fade out smoothly
                finger.style.transition = "opacity 0.5s ease";
                finger.style.opacity = "0";

                setTimeout(() => wrap.remove(), 500);
            }

        }, speed + 60);
    }

    // ---------- START ----------
    swipe();
}
