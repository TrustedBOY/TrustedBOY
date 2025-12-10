// ===============================
// THEME TOGGLE
// ===============================
const body = document.body;
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-toggle__icon");

function setTheme(theme) {
    if (theme === "light") {
        body.classList.add("theme-light");
        themeIcon.textContent = "🌙";
    } else {
        body.classList.remove("theme-light");
        themeIcon.textContent = "☀";
    }
    localStorage.setItem("trustedboy-theme", theme);
}

(function initTheme() {
    const saved = localStorage.getItem("trustedboy-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)")
        .matches;
    if (saved) {
        setTheme(saved);
    } else if (prefersLight) {
        setTheme("light");
    } else {
        setTheme("dark");
    }
})();

themeToggleBtn.addEventListener("click", () => {
    const current = body.classList.contains("theme-light") ? "light" : "dark";
    setTheme(current === "light" ? "dark" : "light");
});

// ===============================
// NAV: SMOOTH SCROLL + MOBILE TOGGLE
// ===============================
const navLinks = document.querySelectorAll(".nav__link");
const navLinksContainer = document.querySelector(".nav__links");
const navToggle = document.querySelector(".nav__toggle");

navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Close mobile nav after click
        navLinksContainer.classList.remove("nav__links--open");
    });
});

navToggle.addEventListener("click", () => {
    navLinksContainer.classList.toggle("nav__links--open");
});

// ===============================
// HERO TYPEWRITER
// ===============================
const typedElement = document.getElementById("hero-typed-text");
const roles = [
    "games come alive.",
    "code becomes clarity.",
    "ideas evolve into systems.",
    "curiosity drives everything."
];



let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
    const current = roles[roleIndex];
    if (!isDeleting) {
        charIndex++;
        typedElement.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
            setTimeout(() => (isDeleting = true), 1100);
        }
    } else {
        charIndex--;
        typedElement.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    const baseSpeed = 80;
    const delay = isDeleting ? baseSpeed / 1.4 : baseSpeed;
    setTimeout(typeLoop, delay);
}

if (typedElement) {
    typeLoop();
}

// ===============================
// REVEAL ON SCROLL
// ===============================
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal--visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18
        }
    );

    revealElements.forEach((el) => observer.observe(el));
} else {
    // Fallback: just show everything
    revealElements.forEach((el) => el.classList.add("reveal--visible"));
}

// ===============================
// SKILLS: FILTER + ANIMATE METERS
// ===============================
const skillChips = document.querySelectorAll("[data-skill-filter]");
const skillCards = document.querySelectorAll(".skill-card");

skillChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        const filter = chip.dataset.skillFilter;
        skillChips.forEach((c) => c.classList.remove("chip--active"));
        chip.classList.add("chip--active");

        skillCards.forEach((card) => {
            const category = card.dataset.skillCategory;
            const shouldShow = filter === "all" || category === filter;
            card.style.display = shouldShow ? "block" : "none";
        });
    });
});

// Animate meters once they come into view
const skillFills = document.querySelectorAll(".skill-card__meter-fill");

if ("IntersectionObserver" in window) {
    const meterObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const level = el.dataset.skillLevel || 60;
                    el.style.width = `${level}%`;
                    obs.unobserve(el);
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    skillFills.forEach((fill) => meterObserver.observe(fill));
} else {
    skillFills.forEach((fill) => {
        const level = fill.dataset.skillLevel || 60;
        fill.style.width = `${level}%`;
    });
}

// ===============================
// PROJECT MODAL
// ===============================
const projectDetails = {
    triangulation: {
        title: "Java Triangulation Program",
        body:
            "A computational geometry project written in Java. It can generate points, build polygons, execute triangulation algorithms, and render the output using custom PNG and model writers. Designed to explore geometry, algorithm design, and clean object-oriented structure."
    },

    tumblebird: {
        title: "Tumble Bird — Unity 2D Game",
        body:
            "A responsive, physics-based side-scroller similar to Flappy Bird. Features player input handling, obstacle spawning, scoring, animation, and a polished gameplay loop. My first step into real-time game development in Unity."
    }
};

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalCloseEls = document.querySelectorAll("[data-modal-close]");

function openModal(id) {
    const detail = projectDetails[id];
    if (!detail) return;
    modalTitle.textContent = detail.title;
    modalBody.textContent = detail.body;
    modal.classList.add("modal--open");
}

function closeModal() {
    modal.classList.remove("modal--open");
}

document.querySelectorAll(".project-card__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const id = btn.closest(".project-card").dataset.projectId;
        openModal(id);

    });
});

modalCloseEls.forEach((el) => {
    el.addEventListener("click", closeModal);
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("modal--open")) {
        closeModal();
    }
});
// ===============================
// CONTACT FORM + VALIDATION + GOOGLE SCRIPT
// ===============================

// 1) Variables (declare ONCE)
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// 2) Validation function
function validateField(field) {
    const errorSpan = field.parentElement.querySelector(".form-field__error");
    if (!field.value.trim()) {
        errorSpan.textContent = "This field is required.";
        return false;
    }
    if (field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            errorSpan.textContent = "Please enter a valid email.";
            return false;
        }
    }
    errorSpan.textContent = "";
    return true;
}

// 3) Your Google Script URL
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyD3wqJNTVsZYcw6KYB5rf5hqa0s75PLq6Js6ktbNBwcHhTzkDcdcm8YE8hCqWoNaDX/exec";


// 4) Submit Handler
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    formStatus.textContent = "Sending...";

    try {
      await fetch(WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      formStatus.textContent = "Message sent! TrustedBOY will reply soon.";
      contactForm.reset();

    } catch (err) {
      formStatus.textContent = "Network error — try again later.";
    }
  });
}


    // Field validation listeners
    contactForm.querySelectorAll("input, textarea").forEach((field) => {
        field.addEventListener("blur", () => validateField(field));
    });



// ===============================
// FOOTER YEAR
// ===============================
const footerYear = document.getElementById("footer-year");
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}
