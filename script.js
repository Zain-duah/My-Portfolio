const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const year = document.querySelector("#year");
const portraitFrame = document.querySelector(".portrait-frame");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const certificateDialog = document.querySelector(".certificate-dialog");
const certificateDialogTitle = document.querySelector("#certificate-dialog-title");
const certificateDialogDate = document.querySelector(".certificate-dialog-date");
const certificateDialogImage = document.querySelector(".certificate-dialog-image");
const certificateClose = document.querySelector(".certificate-close");
const certificatePlaceholder = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function readStoredTheme() {
  try {
    const theme = localStorage.getItem("theme");
    return theme === "light" || theme === "dark" ? theme : null;
  } catch (error) {
    console.warn("Theme preference could not be read from local storage.", error);
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved to local storage.", error);
  }
}

const storedTheme = readStoredTheme();
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

root.dataset.theme = initialTheme;
themeColorMeta.setAttribute("content", initialTheme === "dark" ? "#151c18" : "#f4f2eb");

function updateThemeButton(theme) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
  themeToggle.innerHTML = theme === "dark"
    ? '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg>'
    : '<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z"></path></svg>';
}

updateThemeButton(initialTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  themeColorMeta.setAttribute("content", nextTheme === "dark" ? "#151c18" : "#f4f2eb");
  saveTheme(nextTheme);
  updateThemeButton(nextTheme);
});

function closeMenu({ restoreFocus = false } = {}) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
  if (restoreFocus) {
    menuToggle.focus();
  }
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (certificateDialog.open) {
    event.preventDefault();
    certificateDialog.close();
    return;
  }

  if (menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu({ restoreFocus: true });
  }
});

document.addEventListener("click", (event) => {
  if (
    window.matchMedia("(max-width: 640px)").matches &&
    !navigation.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 641px)").matches) {
    closeMenu();
  }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  root.classList.add("js-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (!reducedMotion) {
  portraitFrame.addEventListener("pointermove", (event) => {
    const bounds = portraitFrame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    portraitFrame.style.setProperty("--light-x", `${x * 100}%`);
    portraitFrame.style.setProperty("--light-y", `${y * 100}%`);

    if (finePointer) {
      portraitFrame.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
      portraitFrame.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
    }
  });

  portraitFrame.addEventListener("pointerleave", () => {
    portraitFrame.style.setProperty("--light-x", "50%");
    portraitFrame.style.setProperty("--light-y", "50%");
    portraitFrame.style.setProperty("--tilt-x", "0deg");
    portraitFrame.style.setProperty("--tilt-y", "0deg");
  });
}

portraitFrame.addEventListener("click", () => {
  const energized = portraitFrame.classList.toggle("is-energized");
  portraitFrame.setAttribute("aria-pressed", String(energized));
});

portraitFrame.addEventListener("keydown", (event) => {
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    return;
  }

  event.preventDefault();
  const position = getComputedStyle(portraitFrame);
  const currentX = Number.parseFloat(position.getPropertyValue("--light-x")) || 50;
  const currentY = Number.parseFloat(position.getPropertyValue("--light-y")) || 50;
  const step = event.shiftKey ? 10 : 5;
  const nextX = Math.min(95, Math.max(5, currentX + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0)));
  const nextY = Math.min(95, Math.max(5, currentY + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0)));
  portraitFrame.style.setProperty("--light-x", `${nextX}%`);
  portraitFrame.style.setProperty("--light-y", `${nextY}%`);
});

document.querySelectorAll(".credential-card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.dataset.certificateTitle;
    const date = card.dataset.certificateDate;
    const image = card.dataset.certificateImage;

    if (!title || !date || !image) {
      console.error("Certificate card is missing its title, issue date, or image.");
      return;
    }

    certificateDialogTitle.textContent = title;
    certificateDialogDate.textContent = `SoloLearn course certificate · Issued ${date}`;
    certificateDialogImage.src = image;
    certificateDialogImage.alt = `${title} course certificate issued to Zain Duah by SoloLearn on ${date}`;
    certificateDialogImage.removeAttribute("aria-hidden");
    certificateDialogImage.hidden = false;
    certificateDialog.showModal();
  });

  if (!reducedMotion && finePointer) {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--card-pointer-x", `${x * 100}%`);
      card.style.setProperty("--card-pointer-y", `${y * 100}%`);
      card.style.setProperty("--card-tilt-x", `${(0.5 - y) * 3}deg`);
      card.style.setProperty("--card-tilt-y", `${(x - 0.5) * 4}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-pointer-x", "50%");
      card.style.setProperty("--card-pointer-y", "50%");
      card.style.setProperty("--card-tilt-x", "0deg");
      card.style.setProperty("--card-tilt-y", "0deg");
    });
  }
});

certificateClose.addEventListener("click", () => {
  certificateDialog.close();
});

certificateDialog.addEventListener("close", () => {
  certificateDialogImage.hidden = true;
  certificateDialogImage.alt = "";
  certificateDialogImage.setAttribute("aria-hidden", "true");
  certificateDialogImage.src = certificatePlaceholder;
});

certificateDialog.addEventListener("click", (event) => {
  if (event.target === certificateDialog) {
    certificateDialog.close();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) {
    return;
  }

  const formData = new FormData(contactForm);
  const subject = `Portfolio enquiry from ${formData.get("name")}`;
  const body = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    "",
    formData.get("message")
  ].join("\n");

  formNote.textContent = "Opening your email app with a ready-to-send message.";
  window.location.href = `mailto:zainduah55@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

year.textContent = new Date().getFullYear();
