// ========================================================
//   SIMPLE FLOATING FINGER SWIPE TUTORIAL
//   3 repeats — Right → Left — Auto Remove
//   File: swipeGit.js
// ========================================================

export function startFingerTutorial() {

    // If already running → stop duplicates
    if (document.getElementById("fingerSwipeTutor")) return;

    // Create finger image element
    const finger = document.createElement("img");
    finger.id = "fingerSwipeTutor";
    finger.src = "https://itsnowonline.github.io/js/swipe/finger.png";

    // Styling
    Object.assign(finger.style, {
        position: "fixed",
        bottom: "40%",          // position from bottom
        left: "-50px",          // start outside screen
        width: "120px",
        height: "120px",
        zIndex: "999999",
        pointerEvents: "none",  // does not block UI
        opacity: "1",
        transform: "translateX(0)",
        transition: "transform 1s ease"
    });

    document.body.appendChild(finger);

    let count = 0;

    function swipe() {
        count++;

        // Move right → left
        requestAnimationFrame(() => {
            finger.style.transform = "translateX(300px)";
        });

        // Reset + prepare for next repeat
        setTimeout(() => {

            // Reset movement instantly
            finger.style.transition = "none";
            finger.style.transform = "translateX(0)";
            finger.offsetHeight; // reflow

            // Restore smooth transition
            finger.style.transition = "transform 1s ease";

            // Repeat or end
            if (count < 3) {
                setTimeout(swipe, 200);
            } else {
                // Fade-out & remove
                finger.style.transition = "opacity 0.4s ease";
                finger.style.opacity = "0";
                setTimeout(() => finger.remove(), 400);
            }

        }, 1000);
    }

    swipe();
}
