let isDarkMode = true;
let musicPlaying = false;
let selectedPiece = null;
let puzzleComplete = false;

document.addEventListener("DOMContentLoaded", () => {
  // 1. RÉCUPÉRATION (Via localStorage, comme les autres étapes)
  const savedLang = localStorage.getItem("userLang") || "fr";

  // 2. APPLICATION DE LA TRADUCTION
  applyTranslations(savedLang);

  // 3. LANCEMENT DES AUTRES MODULES
  setupControlButtons();
  updateTime();
  setInterval(updateTime, 1000);
  checkDarkModePreference();
  initializePuzzle();
  initializeGlobalTimer();
  initializePersistentMusic();
});

// --- OBJET DE TRADUCTION DE L'ÉTAPE 11 ---
const translations = {
  fr: {
    title: "Fouille et bafouille",
    instrTitle: "Instructions",
    instrText:
      "Tarek stocke dans son petit atelier de peinture, derrière des couvertures, le matériel nécessaire à la fabrication des fausses têtes et tous les éléments « compromettants », à part les fausses grilles d'aération évidemment. Une cloche retentit et six matons arrivent au pas de charge dans la cellule de Tony : la rumeur court qu'il préparerait une évasion. Une fouille va avoir lieu. Mettez la main sur sept cartes cachées dans sa cellule.",
    puzzleInstr: "Reconstituez ce puzzle.",
    resetBtn: "Réinitialiser",
    nextBtn: "Étape suivante",
    successText: "Vous pouvez maintenant passer à l'étape suivante.",
    successAlert: "🎉 Félicitations ! Vous avez reconstitué le puzzle !",
    modeClair: "Mode Clair",
    modeSombre: "Mode Sombre",
    musiqueOn: "🔈 Activer la musique",
    musiqueOff: "🔊 Couper la musique",
  },
  en: {
    title: "Frisk and Mumble",
    instrTitle: "Instructions",
    instrText:
      "Tarek stores, in his small painting workshop behind some blankets, the materials needed to make the fake heads and all the “compromising” items — except, of course, the fake ventilation grates. A bell rings and six guards storm into Tony's cell: rumor has it he's planning an escape. A search is about to take place. Get your hands on the seven cards hidden in his cell.",
    puzzleInstr: "Rebuild this puzzle.",
    resetBtn: "Reset",
    nextBtn: "Next step",
    successText: "You can now move on to the next step.",
    successAlert: "🎉 Congratulations! You rebuilt the puzzle!",
    modeClair: "Light Mode",
    modeSombre: "Dark Mode",
    musiqueOn: "🔈 Turn music on",
    musiqueOff: "🔊 Turn music off",
  },
  es: {
    title: "Registro y balbuceo",
    instrTitle: "Instrucciones",
    instrText:
      "Tarek guarda en su pequeño taller de pintura, detrás de unas mantas, el material necesario para fabricar las cabezas falsas y todos los elementos «comprometedores», salvo, por supuesto, las rejillas de ventilación falsas. Suena una campana y seis guardias irrumpen a toda prisa en la celda de Tony: corre el rumor de que está preparando una fuga. Va a haber un registro. Encuentra las siete cartas escondidas en su celda.",
    puzzleInstr: "Reconstruye este rompecabezas.",
    resetBtn: "Reiniciar",
    nextBtn: "Siguiente etapa",
    successText: "Ahora puedes pasar a la siguiente etapa.",
    successAlert: "🎉 ¡Felicidades! ¡Has reconstruido el rompecabezas!",
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

  document.documentElement.lang = lang;

  const h1 = document.querySelector("h1");
  if (h1) h1.textContent = t.title;

  const section = document.querySelector(".audio-section");
  if (section) {
    const h3 = section.querySelector("h3");
    const p = section.querySelector("p");
    if (h3) h3.textContent = t.instrTitle;
    if (p) p.textContent = t.instrText;
  }

  const puzzleInstr = document.getElementById("puzzle-instruction");
  if (puzzleInstr) puzzleInstr.textContent = t.puzzleInstr;

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.textContent = t.resetBtn;

  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) nextBtn.textContent = t.nextBtn;

  const successText = document.querySelector("#successMessage p");
  if (successText) successText.textContent = t.successText;

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
      window.location.href = "etape12.html"; // ➜ étape 12
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
  if (musicPlaying) {
    bgm.volume = 0.2;
    bgm.play().catch(() => {});
  } else {
    bgm.pause();
  }
  updateControlTexts(getLang());
}

function initializePersistentMusic() {
  if (sessionStorage.getItem("escapeRoomMusicPlaying") === "true") {
    musicPlaying = true;
    const bgm = document.getElementById("backgroundMusic");
    if (bgm) {
      bgm.volume = 0.2;
      bgm.play().catch(() => {});
    }
  }
  updateControlTexts(getLang());
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

// --- CHRONO GLOBAL (60 min, partagé avec toutes les étapes) ---
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

  // L'image de réussite reste cachée tant que le puzzle n'est pas fini
  const successMessage = document.getElementById("successMessage");
  if (successMessage) successMessage.style.display = "none";
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
}