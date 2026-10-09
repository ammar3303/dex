let isDarkMode = true;
let musicPlaying = false;

document.addEventListener("DOMContentLoaded", () => {
  // 1. RÉCUPÉRATION (Via localStorage comme ton script.js)
  const savedLang = localStorage.getItem("userLang") || "fr";

  // 2. APPLICATION DE LA TRADUCTION
  applyTranslations(savedLang);

  // 3. LANCEMENT DES AUTRES MODULES
  setupControlButtons();
  updateTime();
  setInterval(updateTime, 1000);
  checkDarkModePreference();
  setupPrisonerListInteractions();
  setupModals();
  initializeGlobalTimer();
  initializePersistentMusic();
  initializeAmbientSound();
  setupPageUnloadHandler();
});

// --- OBJET DE TRADUCTION DU JEU ---
const translations = {
fr: {
    title: "Lettres et le Néant",
    instrTitle: "Instructions",
    instrText: "Un message codé semble se cacher dans le menu du réfectoire : Vol-au-vent et emmental.",
    objTitle: "Objectif",
    objText: "Trouver le message caché dans ce texte.",
    hintBtn: "Afficher un indice",
    choiceTitle: "Faites votre choix",
    listTitle: "Liste d'hologramme",
    chooseBtn: "Choisir cette liste",
    hintModal: "Indice",
    hintText: "Ces lettres constitueront 4 mots.",
    modeClair: "Mode Clair",
    modeSombre: "Mode Sombre",
    musiqueOn: "🔈 Activer la musique",
    musiqueOff: "🔊 Couper la musique"
  },
  en: {
    title: "Letters and Nothingness",
    instrTitle: "Instructions",
    instrText: "A coded message seems to be hidden in the cafeteria menu: Vol-au-vent and emmental.",
    objTitle: "Objective",
    objText: "Find the hidden message in this text.",
    hintBtn: "Show a hint",
    choiceTitle: "Make your choice",
    listTitle: "Hologram list",
    chooseBtn: "Choose this list",
    hintModal: "Hint",
    hintText: "These letters will form 4 words.",
    modeClair: "Light Mode",
    modeSombre: "Dark Mode",
    musiqueOn: "🔈 Enable music",
    musiqueOff: "🔊 Disable music"
  },
  es: {
    title: "Las letras y la nada",
    instrTitle: "Instrucciones",
    instrText: "Un mensaje cifrado parece esconderse en el menú del comedor: Vol-au-vent y emmental.",
    objTitle: "Objetivo",
    objText: "Encontrar el mensaje oculto en este texto.",
    hintBtn: "Mostrar una pista",
    choiceTitle: "Haz tu elección",
    listTitle: "Lista de hologramas",
    chooseBtn: "Elegir esta lista",
    hintModal: "Pista",
    hintText: "Estas letras formarán 4 palabras.",
    modeClair: "Modo Claro",
    modeSombre: "Modo Oscuro",
    musiqueOn: "🔈 Activar música",
    musiqueOff: "🔊 Desactivar música"
  }
};


function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  // Éléments principaux
  const h1 = document.querySelector("h1");
  if (h1) h1.textContent = t.title;

  const sections = document.querySelectorAll(".audio-section");
  if (sections.length >= 2) {
    const h3_1 = sections[0].querySelector("h3");
    const p_1 = sections[0].querySelector("p");
    const h3_2 = sections[1].querySelector("h3");
    const p_2 = sections[1].querySelector("p");
    if (h3_1) h3_1.textContent = t.instrTitle;
    if (p_1) p_1.textContent = t.instrText;
    if (h3_2) h3_2.textContent = t.objTitle;
    if (p_2) p_2.textContent = t.objText;
  }

  const hintBtn = document.getElementById("hintButton");
  if (hintBtn) hintBtn.textContent = t.hintBtn;

  // --- CORRECTION APPLIQUÉE ICI ---
  const hintModalTitle = document.querySelector("#hintModal h2");
  const hintModalText = document.getElementById("hintText");
  if (hintModalTitle) hintModalTitle.textContent = t.hintModal;
  if (hintModalText) hintModalText.textContent = t.hintText;
  // --------------------------------

  const choiceH2 = document.querySelector(".container.fade-in-delay-3 h2");
  if (choiceH2) choiceH2.textContent = t.choiceTitle;

  document.querySelectorAll(".choice-box").forEach((box, index) => {
    const title = box.querySelector("h3");
    const btn = box.querySelector(".btn");
    if (title) title.textContent = `${t.listTitle} #${index + 1}`;
    if (btn) btn.textContent = t.chooseBtn;
  });

  updateControlTexts(lang);
}

function updateControlTexts(lang) {
  const t = translations[lang];
  const dmBtn = document.getElementById("dark-mode-toggle");
  const muBtn = document.getElementById("music-toggle");

  if (dmBtn) {
    dmBtn.textContent = document.body.classList.contains("light-mode")
      ? t.modeSombre
      : t.modeClair;
  }

  if (muBtn) {
    muBtn.textContent = musicPlaying ? t.musiqueOff : t.musiqueOn;
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  sessionStorage.setItem("darkMode", isLight ? "light" : "dark");

  const lang = localStorage.getItem("userLang") || "fr";
  updateControlTexts(lang);
}

function checkDarkModePreference() {
  if (sessionStorage.getItem("darkMode") === "light") {
    document.body.classList.add("light-mode");
  }
  const lang = localStorage.getItem("userLang") || "fr";
  updateControlTexts(lang);
}

function toggleMusic() {
  const bgm = document.getElementById("backgroundMusic");
  if (!bgm) return;
  musicPlaying = !musicPlaying;
  sessionStorage.setItem("escapeRoomMusicPlaying", musicPlaying);
  musicPlaying ? bgm.play() : bgm.pause();

  const lang = localStorage.getItem("userLang") || "fr";
  updateControlTexts(lang);
}

function setupControlButtons() {
  const dm = document.getElementById("dark-mode-toggle");
  const mu = document.getElementById("music-toggle");
  if (dm) dm.onclick = toggleDarkMode;
  if (mu) mu.onclick = toggleMusic;
}

function updateTime() {
  const clock = document.getElementById("clock");
  const dateDisp = document.getElementById("date");
  if (!clock || !dateDisp) return;
  const now = new Date();
  const currentLang = localStorage.getItem("userLang") || "fr";
  const locale =
    currentLang === "en" ? "en-US" : currentLang === "es" ? "es-ES" : "fr-FR";
  clock.textContent = now.toLocaleTimeString(locale, { hour12: false });
  dateDisp.textContent = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
}

function initializeGlobalTimer() {
  const timerElement = document.getElementById("time-remaining");
  const progressBar = document.getElementById("progress-bar");
  if (!timerElement || !progressBar) return;
  const totalTime = 3600;
  let timeLeft;
  const savedStart = sessionStorage.getItem("escapeRoomStartTime");
  const now = Date.now();
  if (savedStart) {
    const elapsed = Math.floor((now - parseInt(savedStart)) / 1000);
    timeLeft = Math.max(0, totalTime - elapsed);
  } else {
    timeLeft = totalTime;
    sessionStorage.setItem("escapeRoomStartTime", now.toString());
  }
  const interval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(interval);
      sessionStorage.removeItem("escapeRoomStartTime");
      window.location.href = "echec.html";
      return;
    }
    timeLeft--;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerElement.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    progressBar.style.width = `${(timeLeft / totalTime) * 100}%`;
  }, 1000);
}

function initializePersistentMusic() {
  if (sessionStorage.getItem("escapeRoomMusicPlaying") === "true") {
    musicPlaying = true;
    const bgm = document.getElementById("backgroundMusic");
    if (bgm) bgm.play().catch(() => {});
  }
  const lang = localStorage.getItem("userLang") || "fr";
  updateControlTexts(lang);
}

function setupModals() {
  const hb = document.getElementById("hintButton");
  const hm = document.getElementById("hintModal");
  if (hb && hm) hb.onclick = () => (hm.style.display = "block");
  document.querySelectorAll(".close").forEach((c) => {
    c.onclick = () => (c.closest(".modal").style.display = "none");
  });
}

function setupPrisonerListInteractions() {
  document.querySelectorAll(".prisoner-list li").forEach((li) => {
    li.onclick = function () {
      this.style.color = "#ff9900";
    };
  });
}

function initializeAmbientSound() {
  const amb = document.getElementById("ambientSound");
  if (!amb) return;
  document.addEventListener("click", () => amb.play().catch(() => {}), {
    once: true,
  });
}

function setupPageUnloadHandler() {
  let internal = false;
  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => (internal = true));
  });
  window.makeChoice = (url) => {
    internal = true;
    window.location.href = url;
  };
}

function zoomImage(img) {
  const modal = document.getElementById("imageModal");
  const enlargedImg = document.getElementById("enlargedImage");
  if (modal && enlargedImg) {
    modal.style.display = "block";
    enlargedImg.src = img.src;
  }
}
