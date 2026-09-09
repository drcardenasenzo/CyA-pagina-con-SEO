(() => {
  const archive = document.querySelector("[data-consumer-archive]");
  if (!archive) return;

  const cards = [...archive.querySelectorAll("[data-article-card]")];
  const filters = [...document.querySelectorAll("[data-consumer-filter]")];
  const controls = document.querySelector("[data-consumer-controls]");
  const moreButton = document.querySelector("[data-consumer-more]");
  const lessButton = document.querySelector("[data-consumer-less]");
  const count = document.querySelector("[data-consumer-count]");

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const pageSize = () => window.matchMedia("(max-width: 639px)").matches ? 6 : 12;
  let activeTopic = "todos";
  let visibleCount = pageSize();

  cards.forEach((card) => {
    card.dataset.normalizedTopic = normalize(card.dataset.topic);
  });

  const matches = () => cards.filter((card) => {
    const topicMatches = activeTopic === "todos" || card.dataset.normalizedTopic === activeTopic;
    return topicMatches;
  });

  const render = () => {
    const results = matches();
    const visible = Math.min(visibleCount, results.length);
    cards.forEach((card) => { card.hidden = true; });
    results.slice(0, visible).forEach((card) => { card.hidden = false; });
    if (moreButton) moreButton.hidden = visible >= results.length;
    if (lessButton) lessButton.hidden = visible <= pageSize();
    if (controls) controls.hidden = results.length === 0;
    if (count) {
      count.textContent = results.length
        ? `Mostrando ${visible} de ${results.length} artículos`
        : "No encontramos artículos con esa búsqueda.";
      count.hidden = false;
      if (results.length === 0 && controls) controls.hidden = false;
    }
  };

  const preserveControlsPosition = (change) => {
    const before = controls?.getBoundingClientRect().top;
    change();
    render();
    if (!Number.isFinite(before) || !controls) return;
    requestAnimationFrame(() => {
      const after = controls.getBoundingClientRect().top;
      if (Math.abs(after - before) > 1) window.scrollBy(0, after - before);
    });
  };

  moreButton?.addEventListener("click", () => { visibleCount += pageSize(); render(); });
  lessButton?.addEventListener("click", () => {
    preserveControlsPosition(() => { visibleCount = Math.max(pageSize(), visibleCount - pageSize()); });
  });

  filters.forEach((button) => button.addEventListener("click", () => {
    activeTopic = normalize(button.dataset.consumerFilter);
    visibleCount = pageSize();
    filters.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    render();
  }));

  let previousSize = pageSize();
  window.addEventListener("resize", () => {
    const nextSize = pageSize();
    if (nextSize === previousSize) return;
    previousSize = nextSize;
    visibleCount = nextSize;
    render();
  });

  render();
})();
