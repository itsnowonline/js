// ==========================================
// SIMPLE FINGER SWIPE TUTORIAL (3 repeats)
// ==========================================

export function startFingerTutorial() {

    // Already running? → Stop duplicate
    if (document.getElementById("fingerSwipeTutor")) return;

    // Create finger image
    const finger = document.createElement("img");
    finger.id = "fingerSwipeTutor";
    finger.src = "https://itsnowonline.github.io/js/swipe/finger.png";

    // Basic styling
    Object.assign(finger.style, {
        position: "fixed",
        bottom: "40%",
        left: "-50px",             // start from -50px (right side effect)
        width: "120px",
        height: "120px",
        zIndex: "999999",
        pointerEvents: "none",     // user interaction block nahi hogi
        opacity: "1",
        transition: "transform 1s ease"
    });

    document.body.appendChild(finger);

    let count = 0;

    function animate() {
        count++;

        // Move right → left
        requestAnimationFrame(() => {
            finger.style.transform = "translateX(300px)";
        });

        // Reset for next repeat
        setTimeout(() => {
            finger.style.transition = "none";
            finger.style.transform = "translateX(0)";
            finger.offsetHeight; // reflow trick
            finger.style.transition = "transform 1s ease";

            if (count < 3) {
                setTimeout(animate, 200);
            } else {
                // Remove after final animation
                setTimeout(() => {
                    finger.style.opacity = "0";
                    setTimeout(() => finger.remove(), 400);
                }, 400);
            }

        }, 1000);
    }

    animate();
}
