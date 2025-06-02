// Generazione pixel fluttuanti
function createFloatingPixels() {
  const pixelGrid = document.getElementById("pixelGrid");
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24"];

  for (let i = 0; i < 50; i++) {
    const pixel = document.createElement("div");
    pixel.className = "pixel";
    pixel.style.left = Math.random() * 100 + "%";
    pixel.style.animationDelay = Math.random() * 8 + "s";
    pixel.style.animationDuration = Math.random() * 10 + 5 + "s";
    pixel.style.background = colors[Math.floor(Math.random() * colors.length)];
    pixelGrid.appendChild(pixel);
  }
}

// Canvas interattivo pixel art
function initPixelCanvas() {
  const canvas = document.getElementById("pixelCanvas");
  const colorPalette = document.getElementById("colorPalette");
  const clearBtn = document.getElementById("clearBtn");
  const fillBtn = document.getElementById("fillBtn");
  const eraserBtn = document.getElementById("eraserBtn");

  let currentColor = "#ff6b6b";
  let isDrawing = false;
  let currentTool = "brush"; // brush, fill, eraser
  let pixelGrid = [];

  // Crea la griglia 64x64
  for (let i = 0; i < 64 * 64; i++) {
    const cell = document.createElement("div");
    cell.className = "pixel-cell";
    cell.dataset.index = i;
    canvas.appendChild(cell);
    pixelGrid.push("transparent");
  }

  const cells = document.querySelectorAll(".pixel-cell");

  // Gestione palette colori
  colorPalette.addEventListener("click", function (e) {
    if (e.target.classList.contains("color-btn")) {
      document
        .querySelector(".color-btn.selected")
        .classList.remove("selected");
      e.target.classList.add("selected");
      currentColor = e.target.dataset.color;
      currentTool = "brush";
      updateToolButtons();
    }
  });

  // Controlli
  clearBtn.addEventListener("click", function () {
    cells.forEach((cell, index) => {
      cell.style.backgroundColor = "transparent";
      pixelGrid[index] = "transparent";
    });
  });

  fillBtn.addEventListener("click", function () {
    currentTool = currentTool === "fill" ? "brush" : "fill";
    updateToolButtons();
  });

  eraserBtn.addEventListener("click", function () {
    currentTool = currentTool === "eraser" ? "brush" : "eraser";
    updateToolButtons();
  });

  function updateToolButtons() {
    [fillBtn, eraserBtn].forEach(
      (btn) =>
        (btn.style.background = "linear-gradient(45deg, #ff6b6b, #4ecdc4)")
    );

    if (currentTool === "fill") {
      fillBtn.style.background = "linear-gradient(45deg, #f9ca24, #ff9f43)";
    } else if (currentTool === "eraser") {
      eraserBtn.style.background = "linear-gradient(45deg, #f9ca24, #ff9f43)";
    }
  }

  // Funzione flood fill
  function floodFill(startIndex, targetColor, replacementColor) {
    if (targetColor === replacementColor) return;

    const stack = [startIndex];
    const visited = new Set();

    while (stack.length > 0) {
      const index = stack.pop();

      if (visited.has(index) || index < 0 || index >= pixelGrid.length)
        continue;
      if (pixelGrid[index] !== targetColor) continue;

      visited.add(index);
      pixelGrid[index] = replacementColor;
      cells[index].style.backgroundColor =
        replacementColor === "transparent" ? "transparent" : replacementColor;

      const row = Math.floor(index / 64);
      const col = index % 64;

      // Aggiungi celle adiacenti
      if (col > 0) stack.push(index - 1); // sinistra
      if (col < 63) stack.push(index + 1); // destra
      if (row > 0) stack.push(index - 64); // sopra
      if (row < 63) stack.push(index + 64); // sotto
    }
  }

  // Event listeners per il disegno
  cells.forEach((cell, index) => {
    cell.addEventListener("mousedown", function (e) {
      e.preventDefault();
      isDrawing = true;
      handleCellClick(index);
    });

    cell.addEventListener("mouseenter", function () {
      if (isDrawing && currentTool !== "fill") {
        handleCellClick(index);
      }
    });

    cell.addEventListener("click", function () {
      if (currentTool === "fill") {
        const targetColor = pixelGrid[index];
        const replacementColor =
          currentTool === "eraser" ? "transparent" : currentColor;
        floodFill(index, targetColor, replacementColor);
      }
    });
  });

  function handleCellClick(index) {
    if (currentTool === "brush") {
      pixelGrid[index] = currentColor;
      cells[index].style.backgroundColor = currentColor;
    } else if (currentTool === "eraser") {
      pixelGrid[index] = "transparent";
      cells[index].style.backgroundColor = "transparent";
    }
  }

  // Stop drawing
  document.addEventListener("mouseup", function () {
    isDrawing = false;
  });

  // Previeni il drag di default
  canvas.addEventListener("dragstart", function (e) {
    e.preventDefault();
  });
}

// Smooth scroll per i link di navigazione
function initSmoothScroll() {
  const navLinks = document.querySelectorAll(".nav-links a, .cta-button");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
}

// Parallax effect per l'hero
function initParallax() {
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");

    if (hero && heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
}

// Inizializza tutto quando la pagina è caricata
document.addEventListener("DOMContentLoaded", function () {
  createFloatingPixels();
  initPixelCanvas();
  initSmoothScroll();
  initParallax();

  // Aggiungi classe per animazioni CSS quando gli elementi entrano nel viewport
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Osserva le feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });
});

// Effetto di typing per il titolo hero
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

// Attiva effetto typing quando la pagina è caricata
window.addEventListener("load", function () {
  const heroTitle = document.querySelector(".hero h1");
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 80);
    }, 500);
  }
});
