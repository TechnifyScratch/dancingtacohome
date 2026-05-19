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
