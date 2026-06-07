const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = navLinks ? navLinks.querySelectorAll("a") : [];
const revealItems = document.querySelectorAll(".reveal");
const yearEl = document.getElementById("year");
const profileImage = document.getElementById("profileImage");
const profileFallback = document.getElementById("profileFallback");
const particlesContainer = document.getElementById("particles");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isMobile = window.matchMedia("(max-width: 600px)").matches;
const glowCards = document.querySelectorAll(".glow-card");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (profileImage && profileFallback) {
  profileImage.addEventListener("error", () => {
    profileImage.style.display = "none";
    profileFallback.style.display = "grid";
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

function createParticle(index) {
  if (!particlesContainer) {
    return;
  }

  const dot = document.createElement("span");
  dot.className = "particle";
  dot.style.left = `${Math.random() * 100}%`;
  dot.style.bottom = `${-10 - Math.random() * 30}px`;
  dot.style.opacity = `${0.3 + Math.random() * 0.5}`;
  dot.style.animationDelay = `${index * 0.3}s`;
  dot.style.animationDuration = `${8 + Math.random() * 6}s`;
  particlesContainer.appendChild(dot);
}

function createRune(index) {
  if (!particlesContainer) {
    return;
  }

  const runeChars = ["ᚱ", "ᛉ", "ᚠ", "ᛞ", "✦", "✧"];
  const rune = document.createElement("span");
  rune.className = "rune";
  rune.textContent = runeChars[index % runeChars.length];
  rune.style.left = `${Math.random() * 100}%`;
  rune.style.bottom = `${-20 - Math.random() * 50}px`;
  rune.style.opacity = `${0.2 + Math.random() * 0.5}`;
  rune.style.animationDelay = `${index * 0.75}s`;
  rune.style.animationDuration = `${10 + Math.random() * 8}s`;
  particlesContainer.appendChild(rune);
}

function updateGlowPosition(clientX, clientY) {
  const x = (clientX / window.innerWidth) * 100;
  const y = (clientY / window.innerHeight) * 100;
  document.body.style.setProperty("--mx", `${x}%`);
  document.body.style.setProperty("--my", `${y * 0.7}%`);
}

for (let i = 0; i < (isMobile ? 22 : 30); i += 1) {
  if (!reducedMotion) {
    createParticle(i);
  }
}

for (let i = 0; i < (isMobile ? 10 : 14); i += 1) {
  if (!reducedMotion) {
    createRune(i);
  }
}

if (!reducedMotion) {
  if (finePointer) {
    window.addEventListener("mousemove", (event) => {
      updateGlowPosition(event.clientX, event.clientY);
    });
  } else {
    let touchActive = false;

    window.addEventListener(
      "touchstart",
      () => {
        touchActive = true;
      },
      { passive: true }
    );

    window.addEventListener(
      "touchend",
      () => {
        touchActive = false;
      },
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      (event) => {
        const touch = event.touches[0];
        if (touch) {
          updateGlowPosition(touch.clientX, touch.clientY);
        }
      },
      { passive: true }
    );

    let glowAngle = 0;
    function mobileGlowLoop() {
      if (!touchActive) {
        glowAngle += 0.01;
        const x = 50 + Math.sin(glowAngle) * 20;
        const y = 32 + Math.cos(glowAngle * 0.75) * 14;
        document.body.style.setProperty("--mx", `${x}%`);
        document.body.style.setProperty("--my", `${y}%`);
      }

      requestAnimationFrame(mobileGlowLoop);
    }

    requestAnimationFrame(mobileGlowLoop);
  }
}

glowCards.forEach((card) => {
  if (!finePointer) {
    return;
  }

  card.addEventListener("mousemove", (event) => {
    if (reducedMotion) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 8;
    const rotateX = (0.5 - py) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
