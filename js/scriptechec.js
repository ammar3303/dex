document.addEventListener("DOMContentLoaded", function () {
  // 1. On vérifie TOUT DE SUITE ce qu'il y a dans la mémoire du navigateur
  const savedLang = localStorage.getItem("userLang");
  console.log("Langue détectée dans le localStorage :", savedLang);

  // Si vide, on force 'fr', sinon on QQ la langue sauvegardée
  const lang = savedLang || "fr";

  // 2. Définition des textes
  const translations = {
    fr: {
      title:
        "Visiblement, tu étais plus doué pour compter les billets <br> que pour compter les barreaux !",
      btn: "Retour",
    },
    en: {
      title:
        "Clearly, you were better at counting bills <br> than counting bars!",
      btn: "Back",
    },
    es: {
      title:
        "¡Claramente, se te daba mejor contar billetes <br> que contar barrotes!",
      btn: "Volver",
    },
  };

  // 3. Application des textes
  const h1 = document.querySelector("h1");
  const backBtn = document.querySelector("nav ul li a");

  if (h1) {
    // On récupère la traduction ou le français par défaut si la langue n'existe pas
    const content = translations[lang] || translations["fr"];
    h1.innerHTML = content.title;
    console.log("Texte appliqué :", lang);
  }

  if (backBtn) {
    backBtn.textContent = (translations[lang] || translations["fr"]).btn;
  }

  // 4. Gestion Audio (Lecture forcée)
  const audio = document.getElementById("ambientSound");
  if (audio) {
    const playAudio = () => {
      audio
        .play()
        .then(() => console.log("Audio OK"))
        .catch(() => console.log("En attente d'un clic pour le son"));
    };

    playAudio();
    // Débloque au moindre clic sur la page
    document.addEventListener("click", playAudio, { once: true });
  }
});