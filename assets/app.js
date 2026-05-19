const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const revealEls = Array.from(document.querySelectorAll(".reveal"));
if (revealEls.length) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const staggerEls = Array.from(document.querySelectorAll(".stagger"));
  for (const el of staggerEls) {
    const children = Array.from(el.children);
    children.forEach((child, index) => {
      child.style.setProperty("--stagger-i", String(index));
    });
  }

  if (prefersReduced) {
    for (const el of revealEls) el.classList.add("is-visible");
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );

    for (const el of revealEls) io.observe(el);
  }
}

const settingsSection = document.getElementById("settings");
const settingsToggle = document.querySelector("[data-settings-toggle]");
if (settingsSection && settingsToggle instanceof HTMLButtonElement) {
  const setEnabled = (enabled) => {
    settingsSection.dataset.enabled = enabled ? "true" : "false";
    settingsSection.classList.toggle("settings-off", !enabled);
    settingsToggle.classList.toggle("is-on", enabled);
    settingsToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
  };

  const initialEnabled = settingsSection.dataset.enabled !== "false";
  setEnabled(initialEnabled);

  settingsToggle.addEventListener("click", () => {
    const enabled = settingsSection.dataset.enabled !== "true";
    setEnabled(enabled);
  });
}

const THEME_KEY = "dt_theme";
const root = document.documentElement;

const getTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

const setTheme = (theme) => {
  if (theme === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;
  try {
    if (theme) localStorage.setItem(THEME_KEY, theme);
    else localStorage.removeItem(THEME_KEY);
  } catch {}
};

const moonIcon = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5Z"></path>
</svg>`;

const sunIcon = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>
  <path d="M12 2v2"></path>
  <path d="M12 20v2"></path>
  <path d="M4.93 4.93l1.41 1.41"></path>
  <path d="M17.66 17.66l1.41 1.41"></path>
  <path d="M2 12h2"></path>
  <path d="M20 12h2"></path>
  <path d="M4.93 19.07l1.41-1.41"></path>
  <path d="M17.66 6.34l1.41-1.41"></path>
</svg>`;

const upsertThemeToggle = () => {
  if (document.querySelector(".theme-toggle")) return;
  const btn = document.createElement("button");
  btn.className = "theme-toggle";
  btn.type = "button";
  btn.setAttribute("aria-label", "Toggle dark mode");
  document.body.appendChild(btn);

  const render = () => {
    const isDark = root.dataset.theme === "dark";
    btn.innerHTML = isDark ? sunIcon : moonIcon;
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  };

  render();
  btn.addEventListener("click", () => {
    const isDark = root.dataset.theme === "dark";
    setTheme(isDark ? "light" : "dark");
    render();
  });
};

// Default is light mode; only switch if user explicitly toggled before.
const savedTheme = getTheme();
if (savedTheme === "dark") setTheme("dark");
else setTheme("light");
upsertThemeToggle();
