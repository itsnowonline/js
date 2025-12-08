// =====================================
//   Swipe Alert Tutorial (Auto Close)
//   FULL FILE — 1→2→3 (RTL) + 3→2→1 (LTR)
//   CDN SAFE VERSION
// =====================================

export function startSwipeTutorial() {

    const CDN = "https://itsnowonline.github.io/js/swipe/";

    // ---------- LIGHT OVERLAY ----------
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.35)";
    overlay.style.backdropFilter = "blur(2px)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "999999";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.25s ease";
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.style.opacity = "1");

    // ---------- ALERT BOX ----------
    const box = document.createElement("div");
    box.style.width = "220px";
    box.style.aspectRatio = "540/800";
    box.style.borderRadius = "16px";
    box.style.background = "#0b2317";
    box.style.border = "1px solid rgba(255,255,255,0.22)";
    box.style.position = "relative";
    box.style.overflow = "hidden";
    box.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
    overlay.appendChild(box);

    // ---------- CLOSE BUTTON ----------
    const closeBtn = document.createElement("div");
    closeBtn.innerText = "✕";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "6px";
    closeBtn.style.right = "6px";
    closeBtn.style.fontSize = "22px";
    closeBtn.style.color = "white";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.userSelect = "none";
    closeBtn.style.zIndex = "20";
    box.appendChild(closeBtn);

    closeBtn.onclick = () => {
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 250);
    };

    // ---------- PAGE IMAGES ----------
    const pages = [
        CDN + "page1.jpg",
        CDN + "page2.jpg",
        CDN + "page3.jpg"
    ];

    const imgA = document.createElement("img");
    const imgB = document.createElement("img");

    [imgA, imgB].forEach(img => {
        img.style.position = "absolute";
        img.style.inset = "0";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.opacity = "0";
        img.style.transition = "none";
    });

    box.appendChild(imgA);
    box.appendChild(imgB);

    let current = imgA;
    let incoming = imgB;
    let index = 0;

    current.src = pages[0];
    current.style.opacity = "1";

    // ---------- FINGER ----------
    const finger = document.createElement("img");
    finger.src = CDN + "finger.png";
    finger.style.position = "absolute";
    finger.style.bottom = "40%";
    finger.style.width = "40%";
    finger.style.opacity = "0";
    finger.style.transition = "none";
    finger.style.zIndex = "15";
    box.appendChild(finger);

    // ---------- FINGER SWIPE ----------
    function fingerSwipe(direction, done) {
        const duration = 1200;
        const travelPx = 260;

        finger.style.opacity = "1";
        finger.style.transition = "none";
        finger.style.transform = "translateX(0)";

        if (direction === "rtl") {
            finger.style.right = "-50px";
            finger.style.left = "auto";
        } else {
            finger.style.left = "-50px";
            finger.style.right = "auto";
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                finger.style.transition = `transform ${duration}ms ease, opacity 300ms ease`;
                finger.style.transform =
                    direction === "rtl"
                        ? `translateX(-${travelPx}px)`
                        : `translateX(${travelPx}px)`;
            });
        });

        setTimeout(() => {
            finger.style.opacity = "0";
            finger.style.transition = "none";
            finger.style.transform = "translateX(0)";
            if (done) done();
        }, duration + 200);
    }

    // ---------- PAGE SWIPE ----------
    function swipeTo(targetIndex, direction, done) {
        incoming.src = pages[targetIndex];
        incoming.style.opacity = "1";

        incoming.style.transform =
            direction === "rtl" ? "translateX(100%)" : "translateX(-100%)";

        setTimeout(() => {
            incoming.style.transition = "transform 0.55s ease";
            current.style.transition = "transform 0.55s ease";

            incoming.style.transform = "translateX(0)";
            current.style.transform =
                direction === "rtl" ? "translateX(-100%)" : "translateX(100%)";
        }, 50);

        setTimeout(() => {
            current.style.opacity = "0";
            current.style.transition = "none";
            current.style.transform = "translateX(0)";
            incoming.style.transition = "none";

            let tmp = current;
            current = incoming;
            incoming = tmp;

            index = targetIndex;

            if (done) done();
        }, 600);
    }

    // ---------- FLOW 1→2→3→2→1 ----------
    setTimeout(() => {
        fingerSwipe("rtl", () => {
            swipeTo(1, "rtl", () => {
                setTimeout(() => {
                    fingerSwipe("rtl", () => {
                        swipeTo(2, "rtl", () => {
                            setTimeout(() => {
                                fingerSwipe("ltr", () => {
                                    swipeTo(1, "ltr", () => {
                                        setTimeout(() => {
                                            fingerSwipe("ltr", () => {
                                                swipeTo(0, "ltr", () => {
                                                    setTimeout(() => {
                                                        overlay.style.opacity = "0";
                                                        setTimeout(() => overlay.remove(), 250);
                                                    }, 500);
                                                });
                                            });
                                        }, 700);
                                    });
                                });
                            }, 700);
                        });
                    });
                }, 700);
            });
        });
    }, 400);
}
