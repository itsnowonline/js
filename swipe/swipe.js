// =====================================
//   Swipe Alert Tutorial (Auto Close)
//   FULL FILE — 1→2→3 (RTL) + 3→2→1 (LTR)
// =====================================

export function startSwipeTutorial() {

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

    requestAnimationFrame(() => (overlay.style.opacity = "1"));

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
    const pages = ["page1.jpg", "page2.jpg", "page3.jpg"];

    const imgA = document.createElement("img");
    const imgB = document.createElement("img");

    [imgA, imgB].forEach((img) => {
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
    finger.src = "finger.png";
    finger.style.position = "absolute";
    finger.style.bottom = "40%";
    finger.style.width = "40%"; //width
    finger.style.opacity = "0";
    finger.style.transition = "none";
    finger.style.zIndex = "15";
    box.appendChild(finger);

    // ---------- FINGER SWIPE (directional) ----------
    function fingerSwipe(direction, done) {
        const duration = 1200; // ms
        const travelPx = 260;  // approx box width + margins

        finger.style.opacity = "1";
        finger.style.transition = "none";
        finger.style.transform = "translateX(0)";

        if (direction === "rtl") {
            // start: -50px from right, go to +50px left side
            finger.style.right = "-50px";
            finger.style.left = "auto";
        } else {
            // ltr: start -50px from left, go to +50px right side
            finger.style.left = "-50px";
            finger.style.right = "auto";
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                finger.style.transition = `transform ${duration}ms ease, opacity 300ms ease`;
                if (direction === "rtl") {
                    // move right -> left
                    finger.style.transform = `translateX(-${travelPx}px)`;
                } else {
                    // move left -> right
                    finger.style.transform = `translateX(${travelPx}px)`;
                }
            });
        });

        setTimeout(() => {
            finger.style.opacity = "0";
            finger.style.transition = "none";
            finger.style.transform = "translateX(0)";
            if (done) done();
        }, duration + 200);
    }

    // ---------- PAGE SWIPE (directional) ----------
    function swipeTo(targetIndex, direction, done) {
        incoming.src = pages[targetIndex];
        incoming.style.opacity = "1";

        if (direction === "rtl") {
            // new page from right, old to left
            incoming.style.transform = "translateX(100%)";
        } else {
            // new page from left, old to right
            incoming.style.transform = "translateX(-100%)";
        }

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

    // ---------- FULL FLOW: 1→2→3→2→1 ----------
    setTimeout(() => {
        // 1 → 2 (RTL)
        fingerSwipe("rtl", () => {
            swipeTo(1, "rtl", () => {
                // 2 → 3 (RTL)
                setTimeout(() => {
                    fingerSwipe("rtl", () => {
                        swipeTo(2, "rtl", () => {
                            // 3 → 2 (LTR)
                            setTimeout(() => {
                                fingerSwipe("ltr", () => {
                                    swipeTo(1, "ltr", () => {
                                        // 2 → 1 (LTR)
                                        setTimeout(() => {
                                            fingerSwipe("ltr", () => {
                                                swipeTo(0, "ltr", () => {
                                                    // AUTO CLOSE
                                                    setTimeout(() => {
                                                        overlay.style.opacity = "0";
                                                        setTimeout(
                                                            () => overlay.remove(),
                                                            250
                                                        );
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