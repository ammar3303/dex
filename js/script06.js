let isDarkMode = true;
let musicPlaying = false;
let selectedPiece = null;
let puzzleComplete = false;

document.addEventListener("DOMContentLoaded", () => {
  // 1. RÉCUPÉRATION (Via localStorage, comme les étapes 1 à 5)
  const savedLang = localStorage.getItem("userLang") || "fr";

  // 2. APPLICATION DE LA TRADUCTION
  applyTranslations(savedLang);

  // 3. LANCEMENT DES AUTRES MODULES
  setupControlButtons();
  updateTime();
  setInterval(updateTime, 1000);
  checkDarkModePreference();
  setupModals();
  initializePuzzle();
  initializeGlobalTimer();
  initializePersistentMusic();
  initializeAmbientSound();
});

// --- OBJET DE TRADUCTION DE L'ÉTAPE 6 ---
const translations = {
  fr: {
    title: "La cible, faire un carton",
    instrTitle: "Instructions",
    instrText:
      "À l'atelier de la prison, les prisonniers confectionnent notamment des emballages en carton « recyclé ». Théo sera chargé de détourner de petites quantités de colle et les autres devront récupérer des chutes de carton de différentes formes. Bien agencées, elles constitueront un carré de la hauteur exacte de la grille d'aération.",
    objTitle: "Objectif",
    objText: "Reconstituer le puzzle de la grille.",
    hintBtn: "Afficher un indice",
    resetBtn: "Réinitialiser",
    successTitle: "🎉 Puzzle résolu avec succès ! 🎉",
    successAlert: "🎉 Félicitations ! Vous avez reconstitué la grille en carton !",
    nextTitle: "Passer à la suite",
    validationTitle: "Validation",
    validationText:
      "Une fois le puzzle terminé, vous pourrez accéder à la cellule suivante.",
    nextBtn: "Étape suivante",
    hintModal: "Indice",
    hintText:
      "Observez bien la continuité des lignes et la position des points dans les angles.",
    modeClair: "Mode Clair",
    modeSombre: "Mode Sombre",
    musiqueOn: "🔈 Activer la musique",
    musiqueOff: "🔊 Couper la musique",
  },
  en: {
    title: "On Target: Cardboard Craft",
    instrTitle: "Instructions",
    instrText:
      "In the prison workshop, the inmates make, among other things, “recycled” cardboard packaging. Théo will be in charge of diverting small amounts of glue, and the others will have to collect cardboard scraps of different shapes. Properly arranged, they will form a square exactly the height of the ventilation grate.",
    objTitle: "Objective",
    objText: "Rebuild the grate puzzle.",
    hintBtn: "Show a hint",
    resetBtn: "Reset",
    successTitle: "🎉 Puzzle successfully solved! 🎉",
    successAlert: "🎉 Congratulations! You rebuilt the cardboard grate!",
    nextTitle: "Move on",
    validationTitle: "Validation",
    validationText:
      "Once the puzzle is complete, you will be able to access the next cell.",
    nextBtn: "Next step",
    hintModal: "Hint",
    hintText:
      "Look closely at how the lines connect and where the dots sit in the corners.",
    modeClair: "Light Mode",
    modeSombre: "Dark Mode",
    musiqueOn: "🔈 Turn music on",
    musiqueOff: "🔊 Turn music off",
  },
  es: {
    title: "En el blanco: hecho de cartón",
    instrTitle: "Instrucciones",
    instrText:
      "En el taller de la prisión, los presos fabrican, entre otras cosas, embalajes de cartón «reciclado». Théo se encargará de desviar pequeñas cantidades de pegamento y los demás deberán recoger recortes de cartón de distintas formas. Bien dispuestos, formarán un cuadrado de la altura exacta de la rejilla de ventilación.",
    objTitle: "Objetivo",
    objText: "Reconstruir el rompecabezas de la rejilla.",
    hintBtn: "Mostrar una pista",
    resetBtn: "Reiniciar",
    successTitle: "🎉 ¡Rompecabezas resuelto con éxito! 🎉",
    successAlert: "🎉 ¡Felicidades! ¡Has reconstruido la rejilla de cartón!",
    nextTitle: "Continuar",
    validationTitle: "Validación",
    validationText:
      "Una vez terminado el rompecabezas, podrás acceder a la siguiente celda.",
    nextBtn: "Siguiente etapa",
    hintModal: "Pista",
    hintText:
      "Observa bien la continuidad de las líneas y la posición de los puntos en las esquinas.",
    modeClair: "Modo Claro",
    modeSombre: "Modo Oscuro",
    musiqueOn: "🔈 Activar música",
    musiqueOff: "🔊 Desactivar música",
  },
};

function getLang() {
  const lang = localStorage.getItem("userLang") || "fr";
  return translations[lang] ? lang : "fr";
}

function applyTranslations(lang) {
  const t = translations[lang] || translations.fr;

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

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.textContent = t.resetBtn;

  const successTitle = document.querySelector("#successMessage h3");
  if (successTitle) successTitle.textContent = t.successTitle;

  const hintModalTitle = document.querySelector("#hintModal h2");
  const hintModalText = document.getElementById("hintText");
  if (hintModalTitle) hintModalTitle.textContent = t.hintModal;
  if (hintModalText) hintModalText.textContent = t.hintText;

  const nextH2 = document.querySelector(".container.fade-in-delay-3 h2");
  if (nextH2) nextH2.textContent = t.nextTitle;

  const choiceBox = document.querySelector(".choice-box");
  if (choiceBox) {
    const title = choiceBox.querySelector("h3");
    const text = choiceBox.querySelector("p");
    if (title) title.textContent = t.validationTitle;
    if (text) text.textContent = t.validationText;
  }

  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) nextBtn.textContent = t.nextBtn;

  updateControlTexts(lang);
}

function updateControlTexts(lang) {
  const t = translations[lang] || translations.fr;
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

// --- BOUTONS ---
function setupControlButtons() {
  const dm = document.getElementById("dark-mode-toggle");
  const mu = document.getElementById("music-toggle");
  const resetBtn = document.getElementById("resetBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (dm) dm.onclick = toggleDarkMode;
  if (mu) mu.onclick = toggleMusic;
  if (resetBtn) resetBtn.onclick = resetPuzzle;
  if (nextBtn) {
    nextBtn.onclick = () => {
      if (!puzzleComplete) return;
      window.location.href = "etape07.html"; // ➜ étape 7
    };
  }
}

// --- MODE CLAIR / SOMBRE ---
function toggleDarkMode() {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  isDarkMode = !isLight;
  sessionStorage.setItem("darkMode", isLight ? "light" : "dark");
  updateControlTexts(getLang());
}

function checkDarkModePreference() {
  if (sessionStorage.getItem("darkMode") === "light") {
    document.body.classList.add("light-mode");
  }
  isDarkMode = !document.body.classList.contains("light-mode");
  updateControlTexts(getLang());
}

// --- MUSIQUE ---
function toggleMusic() {
  const bgm = document.getElementById("backgroundMusic");
  if (!bgm) return;
  musicPlaying = !musicPlaying;
  sessionStorage.setItem("escapeRoomMusicPlaying", musicPlaying);
  musicPlaying ? bgm.play().catch(() => {}) : bgm.pause();
  updateControlTexts(getLang());
}

function initializePersistentMusic() {
  if (sessionStorage.getItem("escapeRoomMusicPlaying") === "true") {
    musicPlaying = true;
    const bgm = document.getElementById("backgroundMusic");
    if (bgm) bgm.play().catch(() => {});
  }
  updateControlTexts(getLang());
}

function initializeAmbientSound() {
  const amb = document.getElementById("ambientSound");
  if (!amb) return;
  document.addEventListener("click", () => amb.play().catch(() => {}), {
    once: true,
  });
}

// --- HORLOGE ---
function updateTime() {
  const clock = document.getElementById("clock");
  const dateDisp = document.getElementById("date");
  if (!clock || !dateDisp) return;
  const now = new Date();
  const lang = getLang();
  const locale = lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "fr-FR";
  clock.textContent = now.toLocaleTimeString(locale, { hour12: false });
  dateDisp.textContent = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
}

// --- CHRONO GLOBAL (60 min, partagé avec les étapes 1 à 5) ---
function initializeGlobalTimer() {
  const timerElement = document.getElementById("time-remaining");
  const progressBar = document.getElementById("progress-bar");
  if (!timerElement || !progressBar) return;

  const totalTime = 3600;
  let savedStart = sessionStorage.getItem("escapeRoomStartTime");
  if (!savedStart) {
    savedStart = Date.now().toString();
    sessionStorage.setItem("escapeRoomStartTime", savedStart);
  }

  function render() {
    const elapsed = Math.floor((Date.now() - parseInt(savedStart, 10)) / 1000);
    const timeLeft = Math.max(0, totalTime - elapsed);
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerElement.textContent = `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
    progressBar.style.width = `${(timeLeft / totalTime) * 100}%`;

    if (timeLeft < 60) {
      progressBar.style.backgroundColor = "#ff3333";
      timerElement.style.color = "#ff3333";
    } else if (timeLeft < 120) {
      progressBar.style.backgroundColor = "#ffcc00";
      timerElement.style.color = "#ffcc00";
    }
    return timeLeft;
  }

  render();
  const interval = setInterval(() => {
    if (render() <= 0) {
      clearInterval(interval);
      sessionStorage.removeItem("escapeRoomStartTime");
      window.location.href = "echec.html";
    }
  }, 1000);
}

// --- FENÊTRE D'INDICE ---
function setupModals() {
  const hb = document.getElementById("hintButton");
  const hm = document.getElementById("hintModal");
  if (hb && hm) hb.onclick = () => (hm.style.display = "block");
  document.querySelectorAll(".close").forEach((c) => {
    c.onclick = () => (c.closest(".modal").style.display = "none");
  });
}

// --- PUZZLE ---
function initializePuzzle() {
  const board = document.getElementById("puzzleBoard");
  if (!board) return;

  board.innerHTML = "";

  const targetPattern = [
    { dots: ["top-left"], lines: ["horizontal"], shape: "corner" },
    { dots: [], lines: ["horizontal"], shape: "edge" },
    { dots: [], lines: ["horizontal"], shape: "edge" },
    { dots: ["top-right"], lines: ["horizontal", "vertical"], shape: "corner" },
    { dots: [], lines: ["vertical"], shape: "edge" },
    { dots: ["center"], lines: ["horizontal", "vertical"], shape: "cross" },
    { dots: ["center"], lines: ["horizontal", "vertical"], shape: "cross" },
    { dots: [], lines: ["vertical"], shape: "edge" },
    { dots: [], lines: ["vertical"], shape: "edge" },
    { dots: ["center"], lines: ["horizontal", "vertical"], shape: "cross" },
    { dots: ["center"], lines: ["horizontal", "vertical"], shape: "cross" },
    { dots: [], lines: ["vertical"], shape: "edge" },
    { dots: ["bottom-left"], lines: ["horizontal", "vertical"], shape: "corner" },
    { dots: [], lines: ["horizontal"], shape: "edge" },
    { dots: [], lines: ["horizontal"], shape: "edge" },
    { dots: ["bottom-right"], lines: [], shape: "corner" },
  ];

  const shuffledPattern = [...targetPattern];
  for (let i = shuffledPattern.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPattern[i], shuffledPattern[j]] = [shuffledPattern[j], shuffledPattern[i]];
  }

  shuffledPattern.forEach((pattern, index) => {
    const piece = document.createElement("div");
    piece.className = `puzzle-piece ${pattern.shape}`;
    piece.dataset.originalIndex = targetPattern.indexOf(pattern);
    piece.dataset.currentIndex = index;

    piece.style.background =
      "linear-gradient(45deg, #d4a574 25%, transparent 25%), linear-gradient(135deg, #d4a574 25%, transparent 25%)";
    piece.style.backgroundSize = "8px 8px";
    piece.style.backgroundColor = "#c9965a";

    pattern.dots.forEach((dotPos) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      switch (dotPos) {
        case "top-left":
          dot.style.top = "5px";
          dot.style.left = "5px";
          break;
        case "top-right":
          dot.style.top = "5px";
          dot.style.right = "5px";
          break;
        case "bottom-left":
          dot.style.bottom = "5px";
          dot.style.left = "5px";
          break;
        case "bottom-right":
          dot.style.bottom = "5px";
          dot.style.right = "5px";
          break;
        case "center":
          dot.style.top = "50%";
          dot.style.left = "50%";
          dot.style.transform = "translate(-50%, -50%)";
          break;
      }
      piece.appendChild(dot);
    });

    pattern.lines.forEach((lineType) => {
      const line = document.createElement("div");
      line.className = `line ${lineType}`;
      line.style.backgroundColor = "#8b4513";
      line.style.position = "absolute";
      if (lineType === "horizontal") {
        line.style.width = "80%";
        line.style.height = "2px";
        line.style.top = "50%";
        line.style.left = "10%";
        line.style.transform = "translateY(-50%)";
      } else {
        line.style.width = "2px";
        line.style.height = "80%";
        line.style.left = "50%";
        line.style.top = "10%";
        line.style.transform = "translateX(-50%)";
      }
      piece.appendChild(line);
    });

    piece.addEventListener("click", () => selectPiece(piece));
    piece.style.cursor = "pointer";
    piece.style.transition = "all 0.3s ease";

    board.appendChild(piece);
  });

  puzzleComplete = false;
  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) nextBtn.disabled = true;
}

function selectPiece(piece) {
  if (selectedPiece === piece) {
    piece.classList.remove("selected");
    piece.style.transform = "scale(1)";
    piece.style.boxShadow = "none";
    selectedPiece = null;
  } else if (selectedPiece === null) {
    piece.classList.add("selected");
    piece.style.transform = "scale(1.1)";
    piece.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.8)";
    selectedPiece = piece;
  } else {
    swapPieces(selectedPiece, piece);
    selectedPiece.classList.remove("selected");
    selectedPiece.style.transform = "scale(1)";
    selectedPiece.style.boxShadow = "none";
    selectedPiece = null;
  }
}

function swapPieces(piece1, piece2) {
  const board = document.getElementById("puzzleBoard");
  const pieces = Array.from(board.children);
  const index1 = pieces.indexOf(piece1);
  const index2 = pieces.indexOf(piece2);

  piece1.style.transform = "scale(0.8) rotate(180deg)";
  piece2.style.transform = "scale(0.8) rotate(-180deg)";

  setTimeout(() => {
    if (index1 < index2) {
      board.insertBefore(piece2, piece1);
      board.insertBefore(piece1, pieces[index2 + 1]);
    } else {
      board.insertBefore(piece1, piece2);
      board.insertBefore(piece2, pieces[index1 + 1]);
    }

    [piece1.dataset.currentIndex, piece2.dataset.currentIndex] = [
      piece2.dataset.currentIndex,
      piece1.dataset.currentIndex,
    ];

    piece1.style.transform = "scale(1)";
    piece2.style.transform = "scale(1)";

    checkPuzzleComplete();
  }, 300);
}

function checkPuzzleComplete() {
  const pieces = Array.from(document.querySelectorAll(".puzzle-piece"));
  let correct = 0;

  pieces.forEach((piece, index) => {
    if (parseInt(piece.dataset.originalIndex) === index) {
      piece.classList.add("correct");
      piece.style.border = "2px solid #4CAF50";
      correct++;
    } else {
      piece.classList.remove("correct");
      piece.style.border = "1px solid #8b4513";
    }
  });

  if (correct === pieces.length) {
    puzzleComplete = true;
    const successMessage = document.getElementById("successMessage");
    const nextBtn = document.getElementById("nextBtn");
    if (successMessage) successMessage.style.display = "block";
    if (nextBtn) nextBtn.disabled = false;

    pieces.forEach((piece, index) => {
      setTimeout(() => {
        piece.style.animation = "pulse 1s ease-in-out";
        piece.style.border = "3px solid gold";
        piece.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.8)";
      }, index * 100);
    });

    setTimeout(() => {
      alert(translations[getLang()].successAlert);
    }, 1000);
  }
}

function resetPuzzle() {
  initializePuzzle();
  const successMessage = document.getElementById("successMessage");
  if (successMessage) successMessage.style.display = "none";
}