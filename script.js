const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navbar = document.querySelector(".navbar");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tahun footer otomatis
const tahunEl = document.getElementById("tahun");
if (tahunEl) tahunEl.textContent = String(new Date().getFullYear());

// Menu mobile (fitur lama, dipertahankan)
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

// Reveal on scroll (fitur lama, dipertahankan)
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

// ===== THEME TOGGLE =====

const themeToggle = document.getElementById("themeToggle");
const THEME_KEY = "orlando_theme";
const applyTheme = () => {
  if (!themeToggle) return;
  const light = document.documentElement.getAttribute("data-theme") === "light";
  themeToggle.setAttribute("aria-pressed", String(light));
  themeToggle.setAttribute("aria-label", light ? "Ganti ke tema gelap" : "Ganti ke tema terang");
};
try {
  if (localStorage.getItem(THEME_KEY) === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
} catch (e) { }
applyTheme();
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", "light");
    try {
      localStorage.setItem(THEME_KEY, isLight ? "dark" : "light");
    } catch (e) { }
    applyTheme();
  });
}

// Progress scroll + navbar shadow + tombol ke atas
const progress = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");
const onScroll = () => {
  const y = window.scrollY || 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  if (navbar) navbar.classList.toggle("is-scrolled", y > 10);
  if (toTop) toTop.classList.toggle("is-show", y > 600);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Transisi halaman lembut (fade-out sebelum pindah halaman)
if (!prefersReducedMotion) {
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const url = link.getAttribute("href");
      if (!url || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      document.body.classList.add("page-leave");
      setTimeout(() => { window.location.href = url; }, 280);
    });
  });
}

// Link nav aktif mengikuti section atau nama halaman
const navLinks = document.querySelectorAll(".nav-menu a");
const curPath = window.location.pathname.split("/").pop() || "index.html";
const isSubpage = curPath.endsWith(".html") && curPath !== "index.html";

if (isSubpage) {
  navLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    const hrefFile = href.split("/").pop();
    if (hrefFile === curPath) {
      a.classList.add("is-active");
    }
  });
} else {
  const sections = [...document.querySelectorAll("main section[id]")];
  if (navLinks.length && sections.length && "IntersectionObserver" in window) {
    const secObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) =>
              a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`)
            );
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => secObs.observe(s));
  }
}

// Animasi skill bar saat terlihat (baca lebar inline asli, lalu animasikan)
const skillFills = document.querySelectorAll(".skill-fill");
skillFills.forEach((el) => {
  el.dataset.target = el.style.width || "0%";
  el.style.width = "0%";
});
if (skillFills.length && "IntersectionObserver" in window && !prefersReducedMotion) {
  const skillObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.target;
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillFills.forEach((el) => skillObs.observe(el));
} else {
  skillFills.forEach((el) => { el.style.width = el.dataset.target; });
}

// Lightbox portofolio (klik gambar untuk pratinjau)
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCap = document.getElementById("lightboxCap");
const lightboxClose = document.getElementById("lightboxClose");
const openLightbox = (src, alt) => {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  if (lightboxCap) lightboxCap.textContent = alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};
const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lightboxImg) lightboxImg.src = "";
};
document.querySelectorAll(".galeri-thumb").forEach((thumb) => {
  thumb.setAttribute("tabindex", "0");
  thumb.setAttribute("role", "button");
  thumb.setAttribute("aria-label", "Buka pratinjau gambar");
  const open = () => openLightbox(thumb.dataset.src || thumb.querySelector("img")?.src || "", thumb.dataset.alt || thumb.querySelector("img")?.alt || "");
  thumb.addEventListener("click", open);
  thumb.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

// Validasi form kontak
const form = document.querySelector(".contact-form");
if (form) {
  const statusEl = document.getElementById("formStatus");
  const kirimBtn = document.getElementById("kirimBtn");
  form.addEventListener("submit", (e) => {
    const nama = document.getElementById("nama");
    const email = document.getElementById("email");
    const pesan = document.getElementById("pesan");
    const emailOk = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!nama || !nama.value.trim() || !emailOk || !pesan || !pesan.value.trim()) {
      e.preventDefault();
      if (!emailOk && email) email.focus();
      else if (nama && !nama.value.trim()) nama.focus();
      else if (pesan) pesan.focus();
      return;
    }
    if (kirimBtn) {
      kirimBtn.disabled = true;
      kirimBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengirim...';
    }
    if (statusEl) {
      statusEl.textContent = "Mengirim... jangan tutup halaman ini.";
      statusEl.classList.add("is-sending");
    }
  });
}

// Music player (2 lagu: Breathe & Bubblegum Party)
const musicPlayer = document.getElementById("musicPlayer");
const musicCollapsed = document.getElementById("musicCollapsed");
const musicToggle = document.getElementById("musicToggle");
const audio = document.getElementById("audioTrack");
const playBtn = document.getElementById("musicPlayBtn");
const prevBtn = document.getElementById("musicPrevBtn");
const nextBtn = document.getElementById("musicNextBtn");
const musicBar = document.getElementById("musicBar");
const musicBarFill = document.getElementById("musicBarFill");
const waktuSekarang = document.getElementById("waktuSekarang");
const waktuTotal = document.getElementById("waktuTotal");
const musicTitle = document.getElementById("musicTitle");
const musicArtist = document.getElementById("musicArtist");
const musicCover = document.getElementById("musicCover");

const playlist = [
  { src: "Breathe.mp3", title: "Breathe", artist: "Olly Alexander", cover: "breathe.logo.jpg" },
  { src: "BubblegumParty.mp3", title: "Bubblegum Party", artist: "Chevy", cover: "bubblegumparty.logo.jpg" },
];
let currentTrack = 0;

const setMusicOpen = (open) => {
  if (!musicPlayer || !musicCollapsed) return;
  musicPlayer.classList.toggle("is-open", open);
  musicCollapsed.setAttribute("aria-expanded", String(open));
  musicCollapsed.setAttribute("aria-label", open ? "Tutup pemutar lagu" : "Buka pemutar lagu");
  if (musicToggle) {
    musicToggle.className = open
      ? "fa-solid fa-chevron-up music-toggle swap"
      : "fa-solid fa-chevron-down music-toggle swap";
  }
};

if (musicPlayer && musicCollapsed) {
  musicCollapsed.addEventListener("click", () => {
    setMusicOpen(!musicPlayer.classList.contains("is-open"));
  });
}

const formatWaktu = (detik) => {
  if (!Number.isFinite(detik) || detik < 0) return "0:00";
  const menit = Math.floor(detik / 60);
  const sisaDetik = Math.floor(detik % 60).toString().padStart(2, "0");
  return `${menit}:${sisaDetik}`;
};

const loadTrack = (index) => {
  currentTrack = (index + playlist.length) % playlist.length;
  const track = playlist[currentTrack];
  if (audio) {
    audio.src = track.src;
    audio.load();
    audio.play().then(() => {}).catch(() => {});
  }
  if (musicTitle) musicTitle.textContent = track.title;
  if (musicArtist) musicArtist.textContent = track.artist;
  if (musicCover) musicCover.src = track.cover;
  if (musicBarFill) musicBarFill.style.width = "0%";
  if (waktuSekarang) waktuSekarang.textContent = "0:00";
  if (waktuTotal) waktuTotal.textContent = "0:00";
};

if (audio && playBtn && musicBar && musicBarFill && waktuSekarang && waktuTotal) {
  const setPlaying = (playing) => {
    playBtn.innerHTML = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    playBtn.setAttribute("aria-label", playing ? "Jeda lagu" : "Putar lagu");
  };

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("ended", () => {
    setPlaying(false);
    loadTrack(currentTrack + 1);
  });

  audio.addEventListener("loadedmetadata", () => {
    waktuTotal.textContent = formatWaktu(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const persen = (audio.currentTime / audio.duration) * 100;
    musicBarFill.style.width = `${persen}%`;
    musicBar.setAttribute("aria-valuenow", String(Math.round(persen)));
    waktuSekarang.textContent = formatWaktu(audio.currentTime);
  });

  const seekFromEvent = (clientX) => {
    if (!audio.duration) return;
    const rect = musicBar.getBoundingClientRect();
    const posisiKlik = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = posisiKlik * audio.duration;
  };

  musicBar.addEventListener("click", (e) => seekFromEvent(e.clientX));
  musicBar.addEventListener("keydown", (e) => {
    if (!audio.duration) return;
    if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
    if (e.key === "ArrowLeft") audio.currentTime = Math.max(audio.currentTime - 5, 0);
  });

  if (prevBtn) prevBtn.addEventListener("click", () => loadTrack(currentTrack - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => loadTrack(currentTrack + 1));
}
