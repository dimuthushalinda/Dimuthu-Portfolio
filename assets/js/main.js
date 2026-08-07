// ==================================================
// SUPABASE CONFIG
// ==================================================
const SUPABASE_URL = "https://lcyfhqltbbewoyhotgzr.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjeWZocWx0YmJld295aG90Z3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxOTUzMDAsImV4cCI6MjEwMDc3MTMwMH0.qdlibAMbDc4MtSsMNqauqz82ZrsmibHkkhkLghrPOkI";

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
// INITIALIZE EVERYTHING
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initStatsCounter();
    console.log("🚀 Portfolio Loaded Successfully!");
});

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
