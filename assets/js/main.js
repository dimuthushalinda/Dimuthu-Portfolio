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

