const loadingScreen = document.getElementById("loading-screen");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const revealItems = document.querySelectorAll(".reveal");
const canvas = document.getElementById("particles");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("load", () => {
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("selesai");
    }
  }, 700);
});

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    navToggle.innerHTML = `<i class="fa-solid fa-${isOpen ? "xmark" : "bars"}"></i>`;
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Buka menu");
      navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

if (revealItems.length && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext("2d");
  const particles = [];
  const particleCount = window.innerWidth < 700 ? 45 : 90;

  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    active: false,
  };

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.active = true;
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    });
  }

  const drawParticles = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    pointer.x += (pointer.targetX - pointer.x) * 0.12;
    pointer.y += (pointer.targetY - pointer.y) * 0.12;

    particles.forEach((particle) => {
      let offsetX = 0;
      let offsetY = 0;

      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.hypot(dx, dy);
      const influenceRadius = 170;

      if (pointer.active && distance > 0 && distance < influenceRadius) {
        const influence = 1 - distance / influenceRadius;
        offsetX = (dx / distance) * influence * 1.1;
        offsetY = (dy / distance) * influence * 1.1;
      }

      particle.x += particle.speedX + offsetX;
      particle.y += particle.speedY + offsetY;

      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(203,166,247,0.5)";
      ctx.fill();
    });

    requestAnimationFrame(drawParticles);
  };

  drawParticles();
}
