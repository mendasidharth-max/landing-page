// ======== LOADER ========
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader && !loader.classList.contains("hidden")) {
    loader.classList.add("hidden");
  }
}
window.addEventListener("load", () => setTimeout(hideLoader, 2200));
// Fallback: force-hide after 3s even if resources fail to load
setTimeout(hideLoader, 3000);

// ======== CUSTOM CURSOR ========
const cursor = document.getElementById("cursor");
const cursorDot = document.getElementById("cursorDot");
let mouseX = 0,
  mouseY = 0;
let cursorX = 0,
  cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX - 3 + "px";
  cursorDot.style.top = mouseY - 3 + "px";
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  cursor.style.left = cursorX - 10 + "px";
  cursor.style.top = cursorY - 10 + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effect on interactive elements
document
  .querySelectorAll(
    "a, button, .service-card, .case-card, .testimonial-card, .team-member, .process-step",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });

// ======== HERO GLOW FOLLOW MOUSE ========
const heroGlow = document.getElementById("heroGlow");
const hero = document.getElementById("hero");

hero.addEventListener("mousemove", (e) => {
  const rect = hero.getBoundingClientRect();
  const x = e.clientX - rect.left - 300;
  const y = e.clientY - rect.top - 300;
  heroGlow.style.left = x + "px";
  heroGlow.style.top = y + "px";
});

// ======== HERO PARTICLES ========
const particleContainer = document.getElementById("heroParticles");
for (let i = 0; i < 30; i++) {
  const p = document.createElement("div");
  p.className = "particle";
  p.style.left = Math.random() * 100 + "%";
  p.style.top = Math.random() * 100 + "%";
  p.style.animationDelay = Math.random() * 4 + "s";
  p.style.animationDuration = 3 + Math.random() * 3 + "s";
  particleContainer.appendChild(p);
}

// ======== SCROLL REVEAL ========
const revealElements = document.querySelectorAll(".reveal");
const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, i * 100);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach((el) => observer.observe(el));

// ======== PARALLAX ON SCROLL ========
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const grid = document.querySelector(".hero-bg-grid");
  if (grid) {
    grid.style.transform = `translateY(${scrollY * 0.3}px)`;
  }
});

// ======== MAGNETIC BUTTONS ========
document
  .querySelectorAll(".btn-primary, .btn-outline, .nav-cta")
  .forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });

// ======== SMOOTH SCROLL FOR ANCHOR LINKS ========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ======== NAV BACKGROUND ON SCROLL ========
const nav = document.querySelector("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    nav.style.background = "rgba(10,10,10,0.9)";
    nav.style.backdropFilter = "blur(20px)";
    nav.style.mixBlendMode = "normal";
  } else {
    nav.style.background = "transparent";
    nav.style.backdropFilter = "none";
    nav.style.mixBlendMode = "difference";
  }
});

// ======== TILT ON CARDS ========
document.querySelectorAll(".service-card, .case-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateY(0) rotateX(0)";
  });
});

// ======== COUNTER ANIMATION ========
const stats = document.querySelectorAll(".stat-number");
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const hasPlus = text.includes("+");
        const hasX = text.includes("x");
        const hasM = text.includes("M");
        const hasPercent = text.includes("%");
        let num = parseFloat(text.replace(/[^0-9.]/g, ""));
        let suffix = hasPlus
          ? "+"
          : hasX
            ? "x"
            : hasM
              ? "M"
              : hasPercent
                ? "%"
                : "";
        let current = 0;
        const duration = 2000;
        const step = num / (duration / 16);
        const isDecimal = text.includes(".");

        function count() {
          current += step;
          if (current >= num) {
            el.textContent =
              (isDecimal ? num.toFixed(1) : Math.floor(num)) + suffix;
            return;
          }
          el.textContent =
            (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
          requestAnimationFrame(count);
        }
        el.textContent = "0" + suffix;
        count();
        statsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);

stats.forEach((s) => statsObserver.observe(s));
