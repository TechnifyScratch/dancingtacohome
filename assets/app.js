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
