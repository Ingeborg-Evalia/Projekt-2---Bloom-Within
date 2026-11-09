
/* BLOG - SØGNING OG KATEGORIFILTRE */

document.addEventListener("DOMContentLoaded", () => {

  const searchInput =
    document.querySelector("#blog-search-input");

  const filterButtons =
    document.querySelectorAll(".blog-page .filter-btn");

  const blogCards =
    document.querySelectorAll(".blog-page .blog-card");

  const noResults =
    document.querySelector("#blog-no-results");

  // Stop på sider uden blogfiltre
  if (!searchInput || !blogCards.length) return;

  let activeCategory = "alle";

  function filterBlogPosts() {

    const searchTerm =
      searchInput.value.trim().toLocaleLowerCase("da-DK");

    let visibleCount = 0;

    blogCards.forEach(card => {

      const categories =
        (card.dataset.category || "").split(/\s+/);

      const cardText =
        card.textContent.toLocaleLowerCase("da-DK");

      const matchesCategory =
        activeCategory === "alle" ||
        categories.includes(activeCategory);

      const matchesSearch =
        cardText.includes(searchTerm);

      const isVisible =
        matchesCategory && matchesSearch;

      card.hidden = !isVisible;

      if (isVisible) visibleCount++;

    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  }

  // Søgning
  searchInput.addEventListener("input", filterBlogPosts);

  // Kategoriknapper
  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      activeCategory = button.dataset.filter;

      filterButtons.forEach(btn => {
        const selected = btn === button;

        btn.classList.toggle("active", selected);

        btn.setAttribute(
          "aria-pressed",
          String(selected)
        );
      });

      filterBlogPosts();

    });

  });

});






/* ==========================
   GLOBAL TILGÆNGELIGHED
========================== */

document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.querySelector(
    "#accessibility-toggle"
  );

  const panel = document.querySelector(
    "#accessibility-panel"
  );

  const darkCheckbox = document.querySelector(
    "#site-dark-mode"
  );

  const fontSelect = document.querySelector(
    "#site-font-size"
  );

  const easyCheckbox = document.querySelector(
    "#site-easy-read"
  );

  const resetBtn = document.querySelector(
    "#reset-accessibility"
  );

  // ARTIKELKNAPPER
  const articleDark = document.querySelector(
    "#article-dark-mode"
  );

  const articleBigger = document.querySelector(
    "#article-increase-text"
  );

  const articleSmaller = document.querySelector(
    "#article-decrease-text"
  );

  const articleEasy = document.querySelector(
    "#article-easy-read"
  );

  const validSizes = [
    "normal",
    "large",
    "extra-large"
  ];

  function getSaved(key, fallback) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Siden virker stadig uden lokal lagring.
    }
  }

  let darkMode = getSaved("bw-dark", "false") === "true";
  let fontSize = getSaved("bw-font", "normal");
  let easyRead = getSaved("bw-easy", "false") === "true";

  if (!validSizes.includes(fontSize)) {
    fontSize = "normal";
  }

  function applySettings() {

    document.body.classList.toggle(
      "dark-mode", darkMode
    );

    document.body.classList.toggle(
      "easy-read", easyRead
    );

    document.documentElement.classList.remove(
      "font-large",
      "font-extra-large"
    );

    document.body.classList.remove(
      "font-large",
      "font-extra-large"
    );

    if (fontSize !== "normal") {
      document.documentElement.classList.add(
        "font-" + fontSize
      );

      document.body.classList.add(
        "font-" + fontSize
      );
    }

    if (darkCheckbox) {
      darkCheckbox.checked = darkMode;
    }

    if (fontSelect) {
      fontSelect.value = fontSize;
    }

    if (easyCheckbox) {
      easyCheckbox.checked = easyRead;
    }

    if (articleDark) {
      articleDark.setAttribute(
        "aria-pressed", String(darkMode)
      );

      articleDark.textContent = darkMode
        ? "☀️ Lys tilstand"
        : "🌙 Mørk tilstand";
    }



    if (articleEasy) {
      articleEasy.setAttribute(
        "aria-pressed",
        String(easyRead)
      );

      articleEasy.textContent = easyRead
        ? "✓ Letlæselig skrift aktiv"
        : "Letlæselig skrift";
    }

    // Gem brugerens indstillinger
    save("bw-dark", String(darkMode));
    save("bw-font", fontSize);
    save("bw-easy", String(easyRead));

  } // Afslutter applySettings()

  // ÅBN / LUK MENU
  
// ÅBN / LUK TILGÆNGELIGHEDSMENU
if (toggle && panel) {

  toggle.addEventListener("click", () => {
    const opening = panel.hidden;

    panel.hidden = !opening;

    toggle.setAttribute(
      "aria-expanded",
      String(opening)
    );
  });

  // Luk menuen med Escape
  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && !panel.hidden) {
      panel.hidden = true;

      toggle.setAttribute(
        "aria-expanded",
        "false"
      );

      toggle.focus();
    }
  });
}


  // FÆLLES INDSTILLINGER
  darkCheckbox?.addEventListener("change", (event) => {
    darkMode = event.target.checked;
    applySettings();
  });

  fontSelect?.addEventListener("change", (event) => {
    fontSize = event.target.value;
    applySettings();
  });

  easyCheckbox?.addEventListener("change", (event) => {
    easyRead = event.target.checked;
    applySettings();
  });

  resetBtn?.addEventListener("click", () => {
    darkMode = false;
    fontSize = "normal";
    easyRead = false;
    applySettings();
  });

  // GENVEJE PÅ ARTIKELSIDEN
  articleDark?.addEventListener("click", () => {
    darkMode = !darkMode;
    applySettings();
  });

  articleEasy?.addEventListener("click", () => {
    easyRead = !easyRead;
    applySettings();
  });

  articleBigger?.addEventListener("click", () => {
    if (fontSize === "normal") {
      fontSize = "large";
    } else {
      fontSize = "extra-large";
    }

    applySettings();
  });

  articleSmaller?.addEventListener("click", () => {
    if (fontSize === "extra-large") {
      fontSize = "large";
    } else {
      fontSize = "normal";
    }

    applySettings();
  });

  // ANVEND GEMTE INDSTILLINGER
  applySettings();

});






/* ==========================
   OPLÆSNING AF ARTIKLER
========================== */

document.addEventListener("DOMContentLoaded", () => {

  const content = document.querySelector(".article-content");
  const readBtn = document.querySelector("#read-aloud");
  const pauseBtn = document.querySelector("#pause-reading");
  const stopBtn = document.querySelector("#stop-reading");
  const status = document.querySelector("#reading-status");

  if (!content || !readBtn || !pauseBtn ||
      !stopBtn || !status) return;

  if (!("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)) {
    readBtn.disabled = true;
    status.textContent =
      "Oplæsning understøttes ikke af din browser.";
    return;
  }

  const speech = window.speechSynthesis;
  let currentSpeech = null;

  function resetButtons() {
    readBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    pauseBtn.textContent = "⏸ Pause";
  }

  readBtn.addEventListener("click", () => {
    speech.cancel();

    const text = content.innerText.trim();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    currentSpeech = utterance;

    utterance.lang = "da-DK";
    utterance.rate = 0.9;

    utterance.onend = () => {
      if (currentSpeech !== utterance) return;

      currentSpeech = null;
      resetButtons();
      status.textContent = "Oplæsningen er færdig.";
    };

    utterance.onerror = () => {
      if (currentSpeech !== utterance) return;

      currentSpeech = null;
      resetButtons();
      status.textContent =
        "Oplæsningen kunne ikke gennemføres.";
    };

    readBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;

    status.textContent = "Oplæsningen er startet.";
    speech.speak(utterance);
  });

  pauseBtn.addEventListener("click", () => {
    if (!currentSpeech) return;

    if (speech.paused) {
      speech.resume();
      pauseBtn.textContent = "⏸ Pause";
      status.textContent = "Oplæsningen fortsætter.";
    } else {
      speech.pause();
      pauseBtn.textContent = "▶ Fortsæt";
      status.textContent = "Oplæsningen er sat på pause.";
    }
  });

  stopBtn.addEventListener("click", () => {
    currentSpeech = null;
    speech.cancel();
    resetButtons();
    status.textContent = "Oplæsningen er stoppet.";
  });

  window.addEventListener("pagehide", () => {
    currentSpeech = null;
    speech.cancel();
  });

});



document.querySelectorAll(".accessibility-close").forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    const panel = closeButton.closest(".accessibility-panel");

    if (!panel) return;

    // Brug den eksisterende knap til at lukke menuen
    const toggleButton = document.querySelector(
      '[aria-controls="' + panel.id + '"]'
    );

    if (toggleButton) {
      toggleButton.click();
    }
  });
});
