// ========================================================
//   swipeGit.js – SIMPLE FINGER ANIMATION (GLOBAL USE)
// ========================================================

export function startSwipeTutorial() {

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
        zIndex: "999999",
        pointerEvents: "none",
        opacity: "1",
        transform: "translateX(0)",
        transition: "transform 1s ease"
    });

    document.body.appendChild(finger);

    let count = 0;

    function run() {
        count++;

        requestAnimationFrame(() => {
            finger.style.transform = "translateX(300px)";
        });

        setTimeout(() => {
            finger.style.transition = "none";
            finger.style.transform = "translateX(0)";
            finger.offsetHeight;
            finger.style.transition = "transform 1s ease";

            if (count < 3) {
                setTimeout(run, 200);
            } else {
                finger.style.transition = "opacity 0.4s ease";
                finger.style.opacity = "0";
                setTimeout(() => finger.remove(), 400);
            }
        }, 1000);
    }

    run();
}
