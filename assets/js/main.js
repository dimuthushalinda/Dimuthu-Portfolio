// ==================================================
// SUPABASE CONFIG
// ==================================================
const SUPABASE_URL = "https://fizudiwdkyalvwilwmpi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpenVkaXdka3lhbHZ3aWx3bXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MzkxOTYsImV4cCI6MjA4MDQxNTE5Nn0.VB-4g0DzyGyWzWPUUmbcRPtdLciVHiYw1or52O-dqZk";

// ==================================================
// SUPABASE INSERT FUNCTION (FULLY FIXED + DEBUG)
// ==================================================
async function insertToSupabase(table, data) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                "Prefer": "return=representation"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log("📌 Supabase Response:", result);

        if (!response.ok) {
            throw new Error(result.message || "Supabase insert failed");
        }

        return result;

    } catch (err) {
        console.error("❌ Supabase Insert Error:", err);
        throw err;
    }
}

// ==================================================
// DOM ELEMENTS
// ==================================================
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");
const backToTop = document.getElementById("backToTop");
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

// ==================================================
// THEME (LIGHT/DARK)
// ==================================================
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
}

themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

// ==================================================
// NAVIGATION + SCROLL
// ==================================================
hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
    backToTop.classList.toggle("visible", window.scrollY > 300);
});

// Back to Top
backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Smooth scroll for links
document.querySelectorAll(".smooth-scroll, .nav-link").forEach(link => {
    link.addEventListener("click", e => {
        const targetId = link.getAttribute("href");
        if (targetId.startsWith("#")) {
            e.preventDefault();
            document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
            navLinks.classList.remove("active");
            hamburger.classList.remove("active");
        }
    });
});

// ==================================================
// FORM VALIDATION
// ==================================================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = `form-message ${type}`;
    setTimeout(() => (formMessage.textContent = ""), 5000);
}

// ==================================================
// CONTACT FORM SUBMISSION
// ==================================================
contactForm.addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name.length < 2) return showFormMessage("Name must be at least 2 characters.", "error");
    if (!validateEmail(email)) return showFormMessage("Enter a valid email address.", "error");
    if (message.length < 10) return showFormMessage("Message must be at least 10 characters.", "error");

    // Loading animation
    const btn = contactForm.querySelector("button");
    const btnText = btn.querySelector(".btn-text");
    const btnLoading = btn.querySelector(".btn-loading");
    btnText.style.display = "none";
    btnLoading.style.display = "inline-block";
    btn.disabled = true;

    const formData = {
        name,
        email,
        message,
        submitted_at: new Date().toISOString()
    };

    try {
        // TEMPORARY: Comment out the line below to work without database
         await insertToSupabase("contact_submissions", formData);
        
        // Instead, just log to console (remove this when Supabase is working)
       console.log("📧 Form Data:", formData);
        console.log("✅ Form would be submitted to Supabase");

        showFormMessage("Message sent successfully! I will reply soon.", "success");
        contactForm.reset();
    } catch (err) {
        showFormMessage(`Error: ${err.message}`, "error");
    } finally {
        btnText.style.display = "inline-block";
        btnLoading.style.display = "none";
        btn.disabled = false;
    }
});

// ==================================================
// HERO STATS CONFIG (EDIT VALUES IN ONE PLACE)
// ==================================================
const HERO_STATS = [
    { value: "3+", labelLine1: "YEARS", labelLine2: "EXPERIENCE" },
    { value: "40+", labelLine1: "PROJECTS", labelLine2: "COMPLETED" },
    { value: "20+", labelLine1: "HAPPY", labelLine2: "CLIENTS" }
];

// ==================================================
// CAMERA ROLL IMAGES LOCATION & CONFIG
// Folder Location: assets/images/camera-roll/
// Place your images in `assets/images/camera-roll/` (e.g. 1.png, 2.png, 7.png, 8.jpg...)
// ==================================================
const CAMERA_ROLL_FOLDER = "assets/images/camera-roll";
const CAMERA_ROLL_ITEMS = [
    {
        file: "1.png",
        code: "FRAME 01A // AI E-LEARNING",
        title: "HNDIT SMART LAB",
        tags: "Next.js • React • TypeScript • Gemini AI",
        link: "https://hnditweb.up.railway.app/"
    },
    {
        file: "2.png",
        code: "FRAME 02A // PERSONAL BRAND",
        title: "PORTFOLIO WEBSITE",
        tags: "HTML5 • CSS3 • JavaScript • Interactive UI",
        link: "https://github.com/Scopiarchy/Portfolio-Website-Personal-Project-"
    },
    {
        file: "3.png",
        code: "FRAME 03A // AI CONSTRUCTION",
        title: "CONSTRUCTAI PLATFORM",
        tags: "React Native • FastAPI • Supabase • Claude AI",
        link: "https://construct-flow.up.railway.app/"
    },
    {
        file: "4.png",
        code: "FRAME 04A // FINTECH BILLING",
        title: "INVOICE BILLING SYSTEM",
        tags: "PHP • MySQL • Tailwind CSS • XAMPP",
        link: "https://github.com/Scopiarchy/Invoice-Billing-System-Web-Application"
    },
    {
        file: "5.png",
        code: "FRAME 05A // EXHIBITION WEB",
        title: "INNOVISION 2026 WEBSITE",
        tags: "HTML5 • Vanilla.js • CSS3 • Particle Physics",
        link: "https://innovision-students.vercel.app/"
    },
    {
        file: "6.png",
        code: "FRAME 06A // FINANCE TRACKER",
        title: "INCOME & EXPENSE TRACKER",
        tags: "Python • Flask • JavaScript • Analytics",
        link: "https://github.com/dimuthu-shalinda/Personal-Expense-and-Income-Manager"
    },
    {
        file: "7.jpg",
        code: "FRAME 07A // COMPETITIVE TRIVIA",
        title: "QUIZ BLITZ PLATFORM",
        tags: "TypeScript • React • Tailwind CSS • Supabase",
        link: "https://github.com/dimuthu-shalinda/quiz-blitz"
    },
    {
        file: "8.png",
        code: "FRAME 08A // EDTECH PLATFORM",
        title: "LMS LEARNING SYSTEM",
        tags: "HTML5 • CSS3 • JavaScript • PHP • MySQL",
        link: "https://live.think-path.com/"
    }
];

function renderHeroStats() {
    const statsContainer = document.getElementById("heroStats");
    if (!statsContainer || !Array.isArray(HERO_STATS)) return;

    statsContainer.innerHTML = HERO_STATS.map(stat => `
        <div class="hero-stat-item">
            <span class="hero-stat-num">${stat.value}</span>
            <span class="hero-stat-label">${stat.labelLine1}<br>${stat.labelLine2}</span>
        </div>
    `).join("");
}

// ==================================================
// INITIALIZE EVERYTHING
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderHeroStats();
    initStatsCounter();
    initModernSectionTitles();
    initServicesBalloonPile();
    initSkillRings();
    initKineticFooterText();
    initExperienceMarqueeAndModal();
    initMidPageKineticRibbon();
    initProjectsCameraRoll();
    initCursorGlow();
    console.log("🚀 Portfolio Loaded Successfully!");
});

// ==================================================
// CUSTOM CURSOR GLOW EFFECT (NO CIRCLE RING)
// ==================================================
function initCursorGlow() {
    const glow = document.getElementById("cursorGlow");
    if (!glow) return;

    // Skip on coarse pointer (touch devices)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = -500;
    let mouseY = -500;
    let glowX = -500;
    let glowY = -500;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function renderCursor() {
        glowX += (mouseX - glowX) * 0.22;
        glowY += (mouseY - glowY) * 0.22;

        glow.style.transform = `translate3d(${(glowX - 220).toFixed(1)}px, ${(glowY - 220).toFixed(1)}px, 0)`;

        requestAnimationFrame(renderCursor);
    }

    requestAnimationFrame(renderCursor);
}

// ==================================================
// WORK EXPERIENCE MARQUEE (RTL) & ZOOM MODAL
// ==================================================
function initExperienceMarqueeAndModal() {
    const track = document.getElementById("experienceMarqueeTrack");
    const modal = document.getElementById("experienceModal");
    const closeBtn = document.getElementById("experienceModalClose");
    if (!track) return;

    // Duplicate the cards once so translateX(-50%) creates a seamless infinite right-to-left loop
    const originalCards = Array.from(track.querySelectorAll(".experience-card"));
    originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("tabindex", "-1");
        track.appendChild(clone);
    });

    if (!modal) return;

    const periodEl = document.getElementById("expModalPeriod");
    const roleEl = document.getElementById("expModalRole");
    const companyEl = document.getElementById("expModalCompany");
    const descEl = document.getElementById("expModalDesc");
    const highlightsEl = document.getElementById("expModalHighlights");
    const tagsEl = document.getElementById("expModalTags");

    function openExpModal(card) {
        const role = card.getAttribute("data-role") || "";
        const company = card.getAttribute("data-company") || "";
        const period = card.getAttribute("data-period") || "";
        const desc = card.getAttribute("data-desc") || "";
        const highlights = (card.getAttribute("data-highlights") || "").split("|").filter(Boolean);
        const tags = (card.getAttribute("data-tags") || "").split(",").filter(Boolean);

        if (periodEl) periodEl.innerHTML = `<i class="far fa-calendar-alt"></i> ${period}`;
        if (roleEl) roleEl.textContent = role;
        if (companyEl) companyEl.innerHTML = `<i class="fas fa-building"></i> ${company}`;
        if (descEl) descEl.textContent = desc;

        if (highlightsEl) {
            highlightsEl.innerHTML = highlights.map((h) => `<li>${h}</li>`).join("");
        }

        if (tagsEl) {
            tagsEl.innerHTML = tags.map((t) => `<span class="exp-modal-tag">${t.trim()}</span>`).join("");
        }

        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeExpModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    }

    track.addEventListener("click", (e) => {
        const card = e.target.closest(".experience-card");
        if (card) {
            openExpModal(card);
        }
    });

    track.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            const card = e.target.closest(".experience-card");
            if (card) {
                e.preventDefault();
                openExpModal(card);
            }
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closeExpModal);
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeExpModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeExpModal();
        }
    });
}

// ==================================================
// KINETIC ALPHABET-SPIN FOOTER TEXT (DIMUTHU / SHALINDA)
// ==================================================
function initKineticFooterText() {
    const banner = document.getElementById("kineticFooterBanner");
    if (!banner) return;

    const rows = Array.from(banner.querySelectorAll(".kinetic-word-row"));
    if (rows.length === 0) return;

    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const REEL_LENGTH = 15; // Stop 0 = target letter, Stops 1..14 = alphabet sequence leading into target letter
    const slots = [];

    rows.forEach((rowEl, rowIdx) => {
        const word = (rowEl.getAttribute("data-word") || "").trim().toUpperCase();
        rowEl.innerHTML = "";

        Array.from(word).forEach((char, charIdx) => {
            const slotEl = document.createElement("div");
            slotEl.className = "kinetic-char-slot";

            const reelEl = document.createElement("div");
            reelEl.className = "kinetic-char-reel";

            const targetAlphaIdx = Math.max(0, ALPHABET.indexOf(char));

            // Build vertical alphabet strip:
            // Stop 0 is the final target letter `char`.
            // As `pos` rolls down from N -> 0 (up-to-down motion), the letters cycle in alphabetical order (... X, Y, Z, A, B, C -> target char)!
            for (let step = 0; step < REEL_LENGTH; step++) {
                const alphaIdx = (targetAlphaIdx - step + ALPHABET.length * 4) % ALPHABET.length;
                const letter = step === 0 ? char : ALPHABET[alphaIdx];
                const g = document.createElement("div");
                const isAccent = step > 0 && step % 2 === 1;
                g.className = `kinetic-glyph${isAccent ? " glyph-accent" : ""}`;
                g.innerHTML = `<span>${letter}</span>`;
                reelEl.appendChild(g);
            }

            slotEl.appendChild(reelEl);
            rowEl.appendChild(slotEl);

            const globalIdx = rowIdx * 8 + charIdx;
            const slotObj = {
                slotEl,
                reelEl,
                rowIdx,
                charIdx,
                globalIdx,
                maxStop: REEL_LENGTH - 1,
                // Start at a staggered alphabet stop so initial entry rolls cleanly down to 0
                pos: 7 + (globalIdx % 6),
                vel: 0,
                speed: 0.085 + (charIdx % 3) * 0.012
            };

            // Letter-by-letter hover: spin through the English alphabet and settle cleanly on this slot's target letter!
            slotEl.addEventListener("mouseenter", () => {
                slotObj.pos = Math.min(slotObj.maxStop, 10 + (charIdx % 3));
                slotObj.vel = -0.35;
            });

            slotEl.addEventListener("click", () => {
                slotObj.pos = slotObj.maxStop;
                slotObj.vel = -0.45;
            });

            slots.push(slotObj);
        });
    });

    let scrollImpulse = 0;
    let lastScrollY = window.scrollY;
    let wasVisible = false;

    // React to page scroll up & down with a decaying impulse that settles back to 0
    window.addEventListener("scroll", () => {
        const currentY = window.scrollY;
        const dy = currentY - lastScrollY;
        lastScrollY = currentY;
        const rect = banner.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            scrollImpulse = Math.min(4.5, scrollImpulse + Math.min(28, Math.abs(dy)) * 0.035);
        }
    }, { passive: true });

    // Also react to mouse wheel at the bottom of the page
    window.addEventListener("wheel", (e) => {
        const rect = banner.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            scrollImpulse = Math.min(4.5, scrollImpulse + Math.min(35, Math.abs(e.deltaY)) * 0.025);
        }
    }, { passive: true });

    function animateReels() {
        const rect = banner.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const isVisible = rect.top < vh * 0.96 && rect.bottom > 0;

        // Re-trigger staggered alphabet spin whenever entering footer from above
        if (isVisible && !wasVisible) {
            slots.forEach((s) => {
                s.pos = Math.max(s.pos, 6 + s.charIdx * 0.85 + s.rowIdx * 2.2);
                s.vel = -0.18;
            });
        }
        wasVisible = isVisible;

        // Decay scroll impulse quickly so letters always settle cleanly on DIMUTHU / SHALINDA
        scrollImpulse *= 0.84;
        if (scrollImpulse < 0.02) scrollImpulse = 0;

        slots.forEach((s) => {
            const firstGlyph = s.reelEl.firstElementChild;
            const slotHeight = (firstGlyph && firstGlyph.offsetHeight) || s.slotEl.clientHeight || 100;

            // Target position is ALWAYS 0 when resting in view, so letters never get stuck half-clipped
            const targetPos = isVisible
                ? Math.min(s.maxStop, scrollImpulse * (0.65 + (s.globalIdx % 4) * 0.2))
                : 7 + (s.globalIdx % 5);

            const diff = targetPos - s.pos;
            s.vel += diff * s.speed;
            s.vel *= 0.74;
            s.pos += s.vel;

            if (s.pos < 0) {
                s.pos = 0;
                s.vel = 0;
            } else if (s.pos > s.maxStop) {
                s.pos = s.maxStop;
            }

            // Snap cleanly to Stop 0 when settled so the target letter is 100% aligned & unclipped
            if (targetPos === 0 && Math.abs(s.pos) < 0.015 && Math.abs(s.vel) < 0.015) {
                s.pos = 0;
                s.vel = 0;
            }

            const translateY = -(s.pos * slotHeight);
            s.reelEl.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
        });

        requestAnimationFrame(animateReels);
    }

    requestAnimationFrame(animateReels);
}

// ==================================================
// CIRCULAR SKILL RINGS ANIMATION
// ==================================================
function initSkillRings() {
    const skillItems = document.querySelectorAll(".skill-ring-item");
    if (skillItems.length === 0) return;

    const circumference = 2 * Math.PI * 52; // r = 52 -> 326.73

    const animateItem = (item, idx) => {
        const percent = Number(item.getAttribute("data-percent")) || 80;
        const progressCircle = item.querySelector(".skill-ring-progress");
        if (!progressCircle) return;

        progressCircle.style.strokeDasharray = `${circumference.toFixed(2)}`;
        const targetOffset = circumference * (1 - percent / 100);

        setTimeout(() => {
            progressCircle.style.strokeDashoffset = `${targetOffset.toFixed(2)}`;
        }, idx * 75);
    };

    const resetItem = (item) => {
        const progressCircle = item.querySelector(".skill-ring-progress");
        if (!progressCircle) return;
        progressCircle.style.strokeDashoffset = `${circumference.toFixed(2)}`;
    };

    const skillsContainer = document.getElementById("skillsSection");
    if (!skillsContainer) {
        skillItems.forEach((item, idx) => animateItem(item, idx));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                skillItems.forEach((item, idx) => animateItem(item, idx));
            } else {
                skillItems.forEach((item) => resetItem(item));
            }
        });
    }, { threshold: 0.2 });

    observer.observe(skillsContainer);
}

// ==================================================
// SERVICES FALLING PILLS & BALLOON HOVER PHYSICS
// ==================================================
function initServicesBalloonPile() {
    const stage = document.getElementById("servicesPileStage");
    const section = document.getElementById("services");
    if (!stage || !section) return;

    const pillElements = Array.from(stage.querySelectorAll(".service-pill"));
    if (pillElements.length === 0) return;

    const banner = document.getElementById("serviceActiveBanner");
    const bannerIcon = document.getElementById("serviceBannerIcon");
    const bannerTitle = document.getElementById("serviceBannerTitle");
    const bannerDesc = document.getElementById("serviceBannerDesc");
    const bannerClose = document.getElementById("serviceBannerClose");
    const inquireBtn = document.getElementById("serviceInquireBtn");

    let stageW = stage.clientWidth;
    let stageH = stage.clientHeight;
    let hasDroppedOnce = false;
    let isSectionVisible = false;
    let selectedServiceName = "";

    // Layout slots (normalized xRatio 0..1, layer 0=bottom..3=top, resting angle in deg)
    // Distributes all 16 service pills across the full portfolio width
    const slotConfigs = [
        // Layer 0 (Bottom floor row)
        { xRatio: 0.13, layer: 0, angle: 0 },
        { xRatio: 0.38, layer: 0, angle: 0 },
        { xRatio: 0.63, layer: 0, angle: 0 },
        { xRatio: 0.87, layer: 0, angle: 0 },
        // Layer 1 (Second row, tilted)
        { xRatio: 0.16, layer: 1, angle: -13 },
        { xRatio: 0.36, layer: 1, angle: 16 },
        { xRatio: 0.56, layer: 1, angle: -6 },
        { xRatio: 0.78, layer: 1, angle: 15 },
        // Layer 2 (Third row, tilted)
        { xRatio: 0.22, layer: 2, angle: 11 },
        { xRatio: 0.44, layer: 2, angle: -14 },
        { xRatio: 0.66, layer: 2, angle: 12 },
        { xRatio: 0.85, layer: 2, angle: -10 },
        // Layer 3 (Top row of the pile)
        { xRatio: 0.28, layer: 3, angle: -8 },
        { xRatio: 0.50, layer: 3, angle: 9 },
        { xRatio: 0.72, layer: 3, angle: -15 },
        { xRatio: 0.58, layer: 3.7, angle: 6 }
    ];

    const bodies = pillElements.map((el, i) => {
        const cfg = slotConfigs[i % slotConfigs.length];
        return {
            el,
            index: i,
            w: el.offsetWidth || 190,
            h: el.offsetHeight || 62,
            x: 0,
            y: -260 - i * 65,
            vx: 0,
            vy: 0,
            angle: (Math.random() - 0.5) * 35,
            va: 0,
            targetX: 0,
            targetY: 0,
            targetAngle: cfg.angle,
            cfg,
            released: false,
            releaseTime: 0,
            isHovered: false,
            hoverPhase: Math.random() * Math.PI * 2,
            floatPhase: Math.random() * Math.PI * 2
        };
    });

    function computeTargets() {
        stageW = stage.clientWidth || 900;
        stageH = stage.clientHeight || 380;
        const isMobile = stageW < 640;

        bodies.forEach((b, i) => {
            b.w = b.el.offsetWidth || 180;
            b.h = b.el.offsetHeight || 56;

            const halfW = b.w / 2;
            const halfH = b.h / 2;
            const padX = 14;

            if (isMobile) {
                // On mobile: 2 columns x 5 rows stacked pile at the bottom
                const col = i % 2;
                const row = Math.floor(i / 2);
                const colRatio = col === 0 ? 0.28 : 0.72;
                const rawX = stageW * colRatio + (row % 2 === 0 ? -6 : 6);
                b.targetX = Math.max(halfW + padX, Math.min(stageW - halfW - padX, rawX));
                b.targetY = stageH - halfH - 8 - row * (b.h * 0.86);
                b.targetAngle = row === 0 ? 0 : (col === 0 ? -9 : 10) * (row % 2 === 0 ? 1 : -0.7);
            } else {
                const rawX = stageW * b.cfg.xRatio;
                b.targetX = Math.max(halfW + padX, Math.min(stageW - halfW - padX, rawX));
                const layerStep = b.h * 0.92;
                b.targetY = stageH - halfH - 10 - b.cfg.layer * layerStep;
                b.targetAngle = b.cfg.angle;
            }

            if (!hasDroppedOnce) {
                b.x = b.targetX + (Math.random() - 0.5) * 40;
                b.y = -180 - i * 60;
            }
        });
    }

    computeTargets();

    // Trigger the one-time drop & title reveal immediately on first scroll down
    function triggerInitialDrop() {
        if (hasDroppedOnce) return;
        hasDroppedOnce = true;
        section.classList.add("services-entered");
        computeTargets();

        const now = performance.now();
        bodies.forEach((b, i) => {
            b.x = b.targetX + (Math.random() - 0.5) * 45;
            b.y = -40 - b.cfg.layer * 38 - (i % 4) * 18;
            b.vx = (Math.random() - 0.5) * 3.5;
            b.vy = 5.2 + Math.random() * 2.4;
            b.angle = b.targetAngle + (Math.random() - 0.5) * 36;
            b.va = (Math.random() - 0.5) * 3;
            b.released = false;
            b.releaseTime = now + i * 28;
        });
    }

    // Hover & Touch: Float upward like balloons when hovered!
    bodies.forEach((b) => {
        b.el.addEventListener("mouseenter", () => {
            if (!hasDroppedOnce) return;
            b.isHovered = true;
            // Immediate balloon lift impulse
            b.vy = Math.min(b.vy, -8.5);
            b.vx += (Math.random() - 0.5) * 3.2;
            b.va += (Math.random() - 0.5) * 2.5;

            // Gently nudge nearby pills like touching a cluster of balloons
            bodies.forEach((other) => {
                if (other === b || !other.released) return;
                const dx = other.x - b.x;
                const dy = other.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 220 && dist > 1) {
                    const push = (220 - dist) / 220;
                    other.vy -= push * 4.2;
                    other.vx += (dx / dist) * push * 3.0;
                    other.va += (Math.random() - 0.5) * 2;
                }
            });
        });

        b.el.addEventListener("mouseleave", () => {
            b.isHovered = false;
        });

        // Touch support for mobile balloon lift
        b.el.addEventListener("touchstart", () => {
            if (!hasDroppedOnce) return;
            b.isHovered = true;
            b.vy = -9.5;
            setTimeout(() => {
                b.isHovered = false;
            }, 950);
        }, { passive: true });

        // Clickable action: bounce + show service info bar
        b.el.addEventListener("click", () => {
            pillElements.forEach(p => p.classList.remove("active-pill"));
            b.el.classList.add("active-pill");

            // Playful upward balloon hop on click
            b.vy = -11;
            b.va = (Math.random() - 0.5) * 4;

            const serviceName = b.el.getAttribute("data-service") || b.el.textContent.trim();
            const iconClass = b.el.getAttribute("data-icon") || "fa-laptop-code";
            const desc = b.el.getAttribute("data-desc") || "";
            selectedServiceName = serviceName;

            if (banner && bannerTitle && bannerDesc && bannerIcon) {
                bannerIcon.innerHTML = `<i class="fas ${iconClass}"></i>`;
                bannerTitle.textContent = serviceName;
                bannerDesc.textContent = desc;
                banner.classList.add("visible");
            }
        });
    });

    if (bannerClose && banner) {
        bannerClose.addEventListener("click", () => {
            banner.classList.remove("visible");
            pillElements.forEach(p => p.classList.remove("active-pill"));
        });
    }

    if (inquireBtn) {
        inquireBtn.addEventListener("click", () => {
            const msgInput = document.getElementById("message");
            if (msgInput && selectedServiceName) {
                msgInput.value = `Hi Dimuthu, I'm interested in your ${selectedServiceName} service and would love to discuss my project.`;
                msgInput.focus({ preventScroll: true });
            }
        });
    }

    // Subsequent Scroll Up / Scroll Down reactive motion + Immediate First-Scroll Trigger
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        const currentY = window.scrollY;
        const deltaY = currentY - lastScrollY;
        lastScrollY = currentY;

        // As soon as the user begins scrolling down on first load, play the ALL YOUR design & dev needs animation
        if (!hasDroppedOnce && currentY > 8) {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 1.15) {
                triggerInitialDrop();
            }
        }

        if (!hasDroppedOnce || !isSectionVisible) return;
        const clampedDelta = Math.max(-45, Math.min(45, deltaY));
        if (Math.abs(clampedDelta) < 1.5) return;

        bodies.forEach((b, idx) => {
            if (!b.released) return;
            // Scroll down lifts/bobs pills slightly; scroll up jostles them
            const factor = 0.16 + (idx % 3) * 0.04;
            b.vy -= clampedDelta * factor;
            b.vx += Math.sin(idx * 1.7 + currentY * 0.02) * (clampedDelta * 0.05);
            b.va += (idx % 2 === 0 ? 1 : -1) * clampedDelta * 0.03;
        });
    }, { passive: true });

    // Observe when #services approaches or enters viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            isSectionVisible = entry.isIntersecting;
            if (entry.isIntersecting && !hasDroppedOnce) {
                triggerInitialDrop();
            }
        });
    }, { threshold: 0.01, rootMargin: "0px 0px 80px 0px" });

    observer.observe(section);

    // Handle window resize
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            computeTargets();
        }, 120);
    });

    // Main 60fps physics & balloon simulation loop
    function step(now) {
        for (let i = 0; i < bodies.length; i++) {
            const b = bodies[i];

            if (!hasDroppedOnce) {
                b.el.style.transform = `translate3d(${b.x - b.w / 2}px, ${b.y - b.h / 2}px, 0) rotate(${b.angle}deg)`;
                continue;
            }

            if (!b.released) {
                if (now >= b.releaseTime) {
                    b.released = true;
                } else {
                    b.el.style.transform = `translate3d(${b.x - b.w / 2}px, ${b.y - b.h / 2}px, 0) rotate(${b.angle}deg)`;
                    continue;
                }
            }

            const halfW = b.w / 2;
            const halfH = b.h / 2;

            if (b.isHovered) {
                // Balloon mode: continuous upward buoyancy toward the upper air of the stage
                const floatCeiling = Math.max(halfH + 14, stageH * 0.22);
                const liftForce = (floatCeiling - b.y) * 0.055;
                b.vy += liftForce - 0.55;
                b.vx += Math.sin(now * 0.005 + b.hoverPhase) * 0.35;
                b.vx *= 0.88;
                b.vy *= 0.84;

                const hoverTargetAngle = Math.sin(now * 0.004 + b.hoverPhase) * 8;
                b.va += (hoverTargetAngle - b.angle) * 0.06;
                b.va *= 0.82;
            } else {
                // Gravity + soft spring settling toward its natural stacked pile slot
                const gravity = 0.68;
                b.vy += gravity;

                // Gentle ambient breathing motion
                const breatheX = Math.sin(now * 0.0022 + b.floatPhase) * 3.5;
                const breatheY = Math.cos(now * 0.0026 + b.floatPhase) * 2.5;

                // Soft horizontal & vertical guidance toward stacked pile slot
                const dxTarget = (b.targetX + breatheX) - b.x;
                const dyTarget = (b.targetY + breatheY) - b.y;

                b.vx += dxTarget * 0.032;
                if (b.y > b.targetY - 30) {
                    b.vy += dyTarget * 0.085;
                }

                // Smooth angular spring toward resting tilt angle
                const dAngle = b.targetAngle - b.angle;
                b.va += dAngle * 0.055;

                b.vx *= 0.86;
                b.vy *= 0.86;
                b.va *= 0.82;
            }

            b.x += b.vx;
            b.y += b.vy;
            b.angle += b.va;

            // Wall & Floor boundaries
            const minX = halfW + 8;
            const maxX = stageW - halfW - 8;
            const maxY = stageH - halfH - 6;
            const minY = halfH + 8;

            if (b.x < minX) {
                b.x = minX;
                b.vx = Math.abs(b.vx) * 0.45;
            } else if (b.x > maxX) {
                b.x = maxX;
                b.vx = -Math.abs(b.vx) * 0.45;
            }

            if (b.y > maxY) {
                b.y = maxY;
                b.vy = -Math.abs(b.vy) * 0.38;
            } else if (b.isHovered && b.y < minY) {
                b.y = minY;
                b.vy = Math.abs(b.vy) * 0.3;
            }
        }

        // Pill-to-pill soft collision repulsion so balloons/pills push each other naturally
        for (let i = 0; i < bodies.length; i++) {
            const a = bodies[i];
            if (!a.released) continue;
            for (let j = i + 1; j < bodies.length; j++) {
                const b = bodies[j];
                if (!b.released) continue;

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const minDistX = (a.w + b.w) * 0.41;
                const minDistY = (a.h + b.h) * 0.78;

                if (Math.abs(dx) < minDistX && Math.abs(dy) < minDistY) {
                    const overlapX = (minDistX - Math.abs(dx)) / minDistX;
                    const overlapY = (minDistY - Math.abs(dy)) / minDistY;

                    if (overlapX < overlapY) {
                        const signX = dx >= 0 ? 1 : -1;
                        const pushX = signX * overlapX * 1.6;
                        a.vx -= pushX;
                        b.vx += pushX;
                    } else {
                        const signY = dy >= 0 ? 1 : -1;
                        const pushY = signY * overlapY * 1.8;
                        a.vy -= pushY;
                        b.vy += pushY;
                    }
                }
            }
        }

        // Render transforms
        for (let i = 0; i < bodies.length; i++) {
            const b = bodies[i];
            const tx = (b.x - b.w / 2).toFixed(2);
            const ty = (b.y - b.h / 2).toFixed(2);
            const rot = b.angle.toFixed(2);
            b.el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

// ==================================================
// STATS COUNTER ANIMATION
// ==================================================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const animateCount = (element) => {
        const target = +element.getAttribute('data-target');
        if (target === 0) return;
        
        const duration = 2000; // 2 seconds
        // Ensure minimum step time and proper increment if target is very large
        let stepTime = Math.abs(Math.floor(duration / target));
        let increment = 1;
        
        if (stepTime < 10) {
            stepTime = 10;
            increment = Math.ceil(target / (duration / stepTime));
        }

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = current;
            }
        }, stepTime);
        
        // Save timer so it can be cleared if scrolled out quickly
        element.dataset.timer = timer;
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                // Clear any existing timer
                if (el.dataset.timer) clearInterval(el.dataset.timer);
                el.textContent = '0';
                animateCount(el);
            } else {
                // Reset when out of view
                if (el.dataset.timer) clearInterval(el.dataset.timer);
                el.textContent = '0';
            }
        });
    }, { threshold: 0.2 });

    stats.forEach(stat => {
        observer.observe(stat);
    });
}

// ==================================================
// HERO ROLE TYPER
// ==================================================
function initRoleTyper() {
    const el = document.getElementById('roleText');
    if (!el) return;
    const roles = [
        'Full Stack Developer',
        'Frontend Engineer',
        'Backend Developer',
        'UI/UX Designer',
        'Creative Designer',
        'Open Source Contributor'
    ];

    let roleIndex = 0;
    let charIndex = el.textContent ? el.textContent.length : 0;
    let isDeleting = false;

    function tick() {
        const current = roles[roleIndex];
        if (isDeleting) {
            charIndex = Math.max(0, charIndex - 1);
            el.textContent = current.substring(0, charIndex);
        } else {
            charIndex = Math.min(current.length, charIndex + 1);
            el.textContent = current.substring(0, charIndex);
        }

        let delay = isDeleting ? 50 : 110;
        if (!isDeleting && charIndex === current.length) {
            delay = 1400;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 300;
        }

        setTimeout(tick, delay);
    }

    // start
    el.textContent = '';
    tick();
}

// initialize role typer after DOM ready
document.addEventListener('DOMContentLoaded', initRoleTyper);

// ==================================================
// IMAGE MODAL LOGIC
// ==================================================
function openModal(src) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = src;
    }
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("imageModal");
    if (!modal) return;
    
    // Close modal on clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });
});

// ==================================================
// MID-PAGE LEFT-TO-RIGHT COLOR-UP / OUTLINE KINETIC BAND
// ==================================================
function initMidPageKineticRibbon() {
    const section = document.getElementById("portfolioKineticBand");
    const track = document.getElementById("kineticRibbonTrack");
    const dragBadge = document.getElementById("ribbonDragBadge");
    if (!section || !track) return;

    // Duplicate items so the track can loop infinitely left-to-right
    const originalItems = Array.from(track.children);
    if (originalItems.length === 0) return;

    originalItems.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });

    const allPhrases = Array.from(track.querySelectorAll(".ribbon-phrase"));

    let halfWidth = track.scrollWidth / 2 || 1800;
    // Start at -halfWidth so moving left-to-right (+dx) increments offsetX toward 0
    let offsetX = -halfWidth;
    const baseSpeed = 1.15; // Positive = Left-to-Right motion
    let dragVelocity = 0;
    let isDragging = false;
    let lastPointerX = 0;

    let badgeX = window.innerWidth * 0.22;
    let badgeY = 36;
    let targetBadgeX = badgeX;
    let targetBadgeY = badgeY;

    window.addEventListener("resize", () => {
        halfWidth = track.scrollWidth / 2 || 1800;
    });

    // Floating DRAG badge follows cursor inside the band
    section.addEventListener("mousemove", (e) => {
        const rect = section.getBoundingClientRect();
        targetBadgeX = e.clientX - rect.left;
        targetBadgeY = Math.max(24, Math.min(rect.height - 24, e.clientY - rect.top - 34));
    }, { passive: true });

    // Pointer drag support (mouse + touch)
    section.addEventListener("pointerdown", (e) => {
        isDragging = true;
        lastPointerX = e.clientX;
        dragVelocity = 0;
        section.setPointerCapture?.(e.pointerId);
    });

    section.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastPointerX;
        lastPointerX = e.clientX;
        offsetX += dx;
        dragVelocity = dx * 0.45;
    });

    const endDrag = () => {
        isDragging = false;
    };
    section.addEventListener("pointerup", endDrag);
    section.addEventListener("pointercancel", endDrag);

    // Subtle scroll boost
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        const sy = window.scrollY;
        const dy = sy - lastScrollY;
        lastScrollY = sy;
        dragVelocity += Math.max(-18, Math.min(18, dy)) * 0.04;
    }, { passive: true });

    function tickRibbon() {
        const secRect = section.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const vw = window.innerWidth || 1200;
        const inView = secRect.bottom > 0 && secRect.top < vh;

        if (!isDragging) {
            offsetX += baseSpeed + dragVelocity;
            dragVelocity *= 0.92;
            if (Math.abs(dragVelocity) < 0.01) dragVelocity = 0;
        }

        // Seamless wrap-around for Left-to-Right motion
        if (halfWidth > 0) {
            if (offsetX >= 0) {
                offsetX -= halfWidth;
            } else if (offsetX < -halfWidth) {
                offsetX += halfWidth;
            }
        }

        track.style.transform = `translate3d(${offsetX.toFixed(2)}px, 0, 0)`;

        // Smoothly move the DRAG badge
        if (dragBadge) {
            badgeX += (targetBadgeX - badgeX) * 0.18;
            badgeY += (targetBadgeY - badgeY) * 0.18;
            dragBadge.style.left = `${badgeX.toFixed(1)}px`;
            dragBadge.style.top = `${badgeY.toFixed(1)}px`;
        }

        // Update each phrase's solid fill vs hollow outline based on screen position:
        // When a phrase is in the active screen zone (left-to-center of screen), it colors up in solid green;
        // outside that zone, it displays as a hollow border outline!
        const verticalFactor = Math.max(0, Math.min(1, (vh * 0.92 - secRect.top) / (vh * 0.35)));
        const activeCutoffX = vw * 0.54;

        for (let i = 0; i < allPhrases.length; i++) {
            const phrase = allPhrases[i];
            if (!inView || verticalFactor <= 0) {
                phrase.style.setProperty("--fill", "0");
                continue;
            }
            const r = phrase.getBoundingClientRect();
            if (r.right < 0 || r.left > vw) {
                phrase.style.setProperty("--fill", "0");
                continue;
            }
            // Portion of the phrase inside the active left-to-center zone of the screen
            const rawFill = (activeCutoffX - r.left) / Math.max(1, r.width);
            const clampedFill = Math.max(0, Math.min(1, rawFill)) * verticalFactor;
            phrase.style.setProperty("--fill", clampedFill.toFixed(3));
        }

        requestAnimationFrame(tickRibbon);
    }

    requestAnimationFrame(tickRibbon);
}

// ==================================================
// MODERN SECTION TITLES & PER-CHARACTER HOVER WAVE
// ==================================================
function initModernSectionTitles() {
    const titleElements = document.querySelectorAll(".section-title, .skills-header-block h3");
    titleElements.forEach((titleEl) => {
        if (titleEl.dataset.modernized === "true") return;
        const rawText = titleEl.textContent.trim();
        if (!rawText) return;

        titleEl.dataset.modernized = "true";
        titleEl.setAttribute("aria-label", rawText);

        const words = rawText.split(/\s+/);
        let charIndex = 0;

        const html = words.map((word, wIdx) => {
            const isAccentWord = words.length > 1 && wIdx === words.length - 1;
            const charsHtml = Array.from(word).map((ch, cIdx) => {
                // For single-word titles (e.g. "Achievements"), accent the second half of characters
                const singleWordAccent = words.length === 1 && cIdx >= Math.ceil(word.length / 2);
                const charSpan = `<span class="title-char" style="--char-i:${charIndex}" aria-hidden="true">${ch}</span>`;
                charIndex++;
                return singleWordAccent
                    ? `<span class="title-word-accent" aria-hidden="true">${charSpan}</span>`
                    : charSpan;
            }).join("");

            return `<span class="title-word${isAccentWord ? " title-word-accent" : ""}" aria-hidden="true">${charsHtml}</span>`;
        }).join(" ");

        titleEl.innerHTML = html;
    });
}

// ==================================================
// PROJECTS 35MM CAMERA ROLL SHOWCASE (RIGHT-TO-LEFT)
// Loads images from `assets/images/camera-roll/`
// ==================================================
function initProjectsCameraRoll() {
    const band = document.getElementById("cameraRollBand");
    const track = document.getElementById("cameraRollTrack");
    if (!band || !track) return;

    const featuredImg = document.getElementById("filmFeaturedImg");
    const featuredCode = document.getElementById("filmFeaturedCode");
    const featuredTitle = document.getElementById("filmFeaturedTitle");
    const featuredTags = document.getElementById("filmFeaturedTags");
    const featuredLink = document.getElementById("filmFeaturedLink");
    const featuredBtnText = document.getElementById("filmFeaturedBtnText");

    const folder = (band.getAttribute("data-folder") || CAMERA_ROLL_FOLDER).replace(/\/$/, "");
    let items = CAMERA_ROLL_ITEMS.map((item, idx) => ({
        ...item,
        edgeNum: `${String(idx + 1).padStart(2, "0")}A`,
        imgPath: item.file.includes("/") ? item.file : `${folder}/${item.file}`
    }));

    function createFrameElement(item, idx, isClone = false) {
        const div = document.createElement("div");
        const isBw = idx % 2 === 1;
        div.className = `camera-film-frame${idx === 0 && !isClone ? " active-frame" : ""}${isBw ? " film-bw" : ""}`;
        if (isClone) div.setAttribute("aria-hidden", "true");
        div.setAttribute("data-code", item.code);
        div.setAttribute("data-title", item.title);
        div.setAttribute("data-tags", item.tags);
        div.setAttribute("data-img", item.imgPath);
        div.setAttribute("data-link", item.link || "#projects");

        div.innerHTML = `
            <div class="film-frame-window">
                <img src="${item.imgPath}" alt="${item.title}" loading="lazy">
                <span class="film-frame-caption">${item.title}</span>
            </div>
            <span class="film-edge-num">${item.edgeNum}</span>
        `;
        return div;
    }

    let singleSetWidth = 1600;

    function activateProjectFrame(frameEl) {
        const title = frameEl.getAttribute("data-title") || "";
        const code = frameEl.getAttribute("data-code") || "";
        const tags = frameEl.getAttribute("data-tags") || "";
        const img = frameEl.getAttribute("data-img") || "";
        const link = frameEl.getAttribute("data-link") || "#projects";

        const allFrames = Array.from(track.querySelectorAll(".camera-film-frame"));
        allFrames.forEach((f) => {
            f.classList.toggle("active-frame", f.getAttribute("data-img") === img);
        });

        if (featuredImg && img && featuredImg.getAttribute("src") !== img) {
            featuredImg.style.opacity = "0.35";
            setTimeout(() => {
                featuredImg.src = img;
                featuredImg.alt = title;
                featuredImg.style.opacity = "1";
            }, 120);
        }
        if (featuredCode) featuredCode.textContent = code;
        if (featuredTitle) featuredTitle.textContent = title;
        if (featuredTags) featuredTags.textContent = tags;
        if (featuredLink) featuredLink.href = link;
        if (featuredBtnText) featuredBtnText.textContent = `EXPLORE ${title}`;
    }

    function renderTrack() {
        track.innerHTML = "";
        for (let copy = 0; copy < 3; copy++) {
            items.forEach((item, idx) => {
                const el = createFrameElement(item, idx, copy > 0);
                el.addEventListener("mouseenter", () => activateProjectFrame(el));
                el.addEventListener("click", () => activateProjectFrame(el));
                track.appendChild(el);
            });
        }
        requestAnimationFrame(() => {
            singleSetWidth = track.scrollWidth / 3 || 1600;
        });
    }

    renderTrack();

    // Auto-detect extra numbered images dropped into `assets/images/camera-roll/` (e.g. 7.png, 7.jpg, 8.png...)
    function probeExtraFolderImages(startNum, maxNum) {
        const exts = ["png", "jpg", "jpeg", "webp"];
        for (let n = startNum; n <= maxNum; n++) {
            exts.forEach((ext) => {
                const candidatePath = `${folder}/${n}.${ext}`;
                const testImg = new Image();
                testImg.onload = () => {
                    if (items.some((it) => it.imgPath === candidatePath)) return;
                    const idx = items.length + 1;
                    items.push({
                        file: `${n}.${ext}`,
                        imgPath: candidatePath,
                        edgeNum: `${String(idx).padStart(2, "0")}A`,
                        code: `FRAME ${String(idx).padStart(2, "0")}A // PROJECT SHOWCASE`,
                        title: `PROJECT SHOT #${n}`,
                        tags: "Portfolio Showcase • Creative Engineering",
                        link: "#projects"
                    });
                    renderTrack();
                };
                testImg.src = candidatePath;
            });
        }
    }

    probeExtraFolderImages(items.length + 1, 15);

    let offsetX = 0;
    const baseSpeed = 1.25; // Right-to-Left motion (offsetX decreases)
    let isHovered = false;

    window.addEventListener("resize", () => {
        singleSetWidth = track.scrollWidth / 3 || 1600;
    });

    band.addEventListener("mouseenter", () => {
        isHovered = true;
    });
    band.addEventListener("mouseleave", () => {
        isHovered = false;
    });

    function animateRoll() {
        const currentSpeed = isHovered ? baseSpeed * 0.28 : baseSpeed;
        offsetX -= currentSpeed;

        if (singleSetWidth > 0 && offsetX <= -singleSetWidth) {
            offsetX += singleSetWidth;
        }

        track.style.transform = `translate3d(${offsetX.toFixed(2)}px, 0, 0)`;
        requestAnimationFrame(animateRoll);
    }

    requestAnimationFrame(animateRoll);
}

// ==================================================
// GRAPHIC DESIGN SHOWCASE & SLIDER LOGIC
// ==================================================
function initDesignGallery() {
    const sliderViewport = document.getElementById('designSliderViewport');
    const sliderTrack = document.getElementById('designSliderTrack');
    const prevBtn = document.getElementById('designPrevBtn');
    const nextBtn = document.getElementById('designNextBtn');
    const progressBar = document.getElementById('designProgressBar');
    const dotsContainer = document.getElementById('designDotsContainer');
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const allCards = Array.from(document.querySelectorAll('.design-card'));

    if (!sliderViewport || !sliderTrack || allCards.length === 0) return;

    let currentIndex = 0;
    let activeFilter = 'all';
    let visibleCards = [...allCards];
    let isAutoplay = true;
    let autoplayInterval = null;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let movedBy = 0;
    let lightboxCurrentIndex = 0;

    // Helper: Calculate visible card count
    function getVisibleCardsCount() {
        const width = window.innerWidth;
        if (width <= 640) return 1;
        if (width <= 1024) return 2;
        return 3;
    }

    // Helper: Maximum slide index
    function getMaxIndex() {
        const visiblePerView = getVisibleCardsCount();
        return Math.max(0, visibleCards.length - visiblePerView);
    }

    // Update Slider Position & Indicators
    function updateSlider(animate = true) {
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        if (!animate) {
            sliderTrack.style.transition = 'none';
        } else {
            sliderTrack.style.transition = 'transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1)';
        }

        if (visibleCards.length === 0) {
            sliderTrack.style.transform = `translateX(0px)`;
            return;
        }

        const firstCard = visibleCards[0];
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(sliderTrack).gap) || 24;
        const offset = currentIndex * (cardWidth + gap);

        sliderTrack.style.transform = `translateX(-${offset}px)`;

        // Update Prev / Next Buttons
        if (prevBtn) prevBtn.disabled = (maxIdx === 0);
        if (nextBtn) nextBtn.disabled = (maxIdx === 0);

        // Update Progress Bar
        if (progressBar) {
            const totalSteps = maxIdx + 1;
            const percentage = totalSteps > 1 ? ((currentIndex + 1) / totalSteps) * 100 : 100;
            progressBar.style.width = `${percentage}%`;
        }

        // Update Dots
        updateDots();
    }

    // Generate & Update Pagination Dots
    function updateDots() {
        if (!dotsContainer) return;
        const maxIdx = getMaxIndex();
        const totalDots = maxIdx + 1;

        if (dotsContainer.children.length !== totalDots) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `design-dot ${i === currentIndex ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                    resetAutoplayTimer();
                });
                dotsContainer.appendChild(dot);
            }
        } else {
            Array.from(dotsContainer.children).forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }
    }

    // Navigation Actions
    function slideNext() {
        const maxIdx = getMaxIndex();
        if (currentIndex < maxIdx) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back
        }
        updateSlider();
    }

    function slidePrev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = getMaxIndex(); // Loop to end
        }
        updateSlider();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            slideNext();
            resetAutoplayTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            slidePrev();
            resetAutoplayTimer();
        });
    }

    // Filter Functionality
    function applyFilter(category) {
        activeFilter = category;
        currentIndex = 0;

        allCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('is-hidden');
            } else {
                card.classList.add('is-hidden');
            }
        });

        visibleCards = allCards.filter(c => !c.classList.contains('is-hidden'));

        // Regenerate dots for the new card count
        dotsContainer.innerHTML = '';
        updateSlider();
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter');
            applyFilter(category);
            resetAutoplayTimer();
        });
    });

    // Autoplay Controls (Continuous Auto-Slide)
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (!isDragging) {
                slideNext();
            }
        }, 3500);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function resetAutoplayTimer() {
        startAutoplay();
    }

    // Pause Autoplay on Hover so user can inspect, resume on leave
    sliderViewport.addEventListener('mouseenter', stopAutoplay);
    sliderViewport.addEventListener('mouseleave', () => {
        if (!isDragging) startAutoplay();
    });

    // Touch & Mouse Drag / Swipe
    function onDragStart(e) {
        isDragging = true;
        sliderViewport.classList.add('is-dragging');
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        currentX = startX;
        movedBy = 0;
    }

    function onDragMove(e) {
        if (!isDragging) return;
        currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        movedBy = currentX - startX;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        sliderViewport.classList.remove('is-dragging');

        // Check swipe distance
        const threshold = 45;
        if (movedBy < -threshold) {
            slideNext();
        } else if (movedBy > threshold) {
            slidePrev();
        }
        movedBy = 0;
        resetAutoplayTimer();
    }

    sliderViewport.addEventListener('mousedown', onDragStart);
    sliderViewport.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);

    sliderViewport.addEventListener('touchstart', onDragStart, { passive: true });
    sliderViewport.addEventListener('touchmove', onDragMove, { passive: true });
    window.addEventListener('touchend', onDragEnd);

    // 3D Tilt Effect on Desktop
    allCards.forEach(card => {
        const inner = card.querySelector('.design-card-inner');
        if (!inner) return;

        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 1024) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            inner.style.transform = '';
        });
    });

    // Lightbox Modal Logic
    const lightbox = document.getElementById('designLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxClient = document.getElementById('lightboxClient');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxTools = document.getElementById('lightboxTools');
    const lightboxFullBtn = document.getElementById('lightboxFullImageBtn');
    const lightboxClose = document.getElementById('lightboxCloseBtn');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const lightboxPrev = document.getElementById('lightboxPrevBtn');
    const lightboxNext = document.getElementById('lightboxNextBtn');

    function openLightbox(index) {
        if (!lightbox || visibleCards.length === 0) return;
        lightboxCurrentIndex = index;
        const card = visibleCards[lightboxCurrentIndex] || visibleCards[0];
        if (!card) return;

        const title = card.getAttribute('data-title') || '';
        const categoryLabel = card.getAttribute('data-category-label') || '';
        const client = card.getAttribute('data-client') || '';
        const imgUrl = card.getAttribute('data-image') || '';
        const tools = (card.getAttribute('data-tools') || '').split(',').map(t => t.trim());
        const desc = card.getAttribute('data-desc') || '';

        if (lightboxImg) lightboxImg.src = imgUrl;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxCategory) lightboxCategory.textContent = categoryLabel;
        if (lightboxClient) {
            const clientSpan = lightboxClient.querySelector('span');
            if (clientSpan) clientSpan.textContent = client;
        }
        if (lightboxDesc) lightboxDesc.textContent = desc;
        if (lightboxFullBtn) lightboxFullBtn.href = imgUrl;

        if (lightboxTools) {
            lightboxTools.innerHTML = '';
            tools.forEach(tool => {
                if (tool) {
                    const badge = document.createElement('span');
                    badge.className = 'design-tool-badge';
                    badge.textContent = tool;
                    lightboxTools.appendChild(badge);
                }
            });
        }

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        stopAutoplay();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        startAutoplay();
    }

    function lightboxNavigate(direction) {
        if (visibleCards.length === 0) return;
        if (direction === 'next') {
            lightboxCurrentIndex = (lightboxCurrentIndex + 1) % visibleCards.length;
        } else {
            lightboxCurrentIndex = (lightboxCurrentIndex - 1 + visibleCards.length) % visibleCards.length;
        }
        openLightbox(lightboxCurrentIndex);
    }

    // Attach click events to design cards
    allCards.forEach((card) => {
        const handleCardOpen = (e) => {
            // Prevent trigger if dragging
            if (Math.abs(movedBy) > 10) return;
            const visibleIdx = visibleCards.indexOf(card);
            if (visibleIdx !== -1) {
                openLightbox(visibleIdx);
            }
        };

        card.addEventListener('click', handleCardOpen);
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => lightboxNavigate('prev'));
    if (lightboxNext) lightboxNext.addEventListener('click', () => lightboxNavigate('next'));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('is-open')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') lightboxNavigate('next');
            if (e.key === 'ArrowLeft') lightboxNavigate('prev');
        }
    });

    // Window Resize Handler with Debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlider(false);
        }, 150);
    });

    // Initialize
    updateSlider(false);
    startAutoplay();
}

// Initialize gallery on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initDesignGallery();
});

