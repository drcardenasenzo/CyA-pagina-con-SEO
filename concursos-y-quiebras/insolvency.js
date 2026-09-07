(() => {
  const archive = document.querySelector("[data-insolvency-archive]");
  if (!archive) return;

  const cards = [...archive.querySelectorAll("[data-article-card]")];
  const search = document.querySelector("[data-insolvency-search]");
  const filters = [...document.querySelectorAll("[data-insolvency-filter]")];
  const controls = document.querySelector("[data-insolvency-controls]");
  const moreButton = document.querySelector("[data-insolvency-more]");
  const lessButton = document.querySelector("[data-insolvency-less]");
  const count = document.querySelector("[data-insolvency-count]");

  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const pageSize = () =>
    window.matchMedia("(max-width: 639px)").matches ? 6 : 12;

  let activeTopic = "todos";
  let query = "";
  let visibleCount = pageSize();

  cards.forEach((card) => {
    card.dataset.searchText = normalize(card.textContent);
    card.dataset.normalizedTopic = normalize(card.dataset.topic);
  });

  const matches = () =>
    cards.filter((card) => {
      const topicMatches =
        activeTopic === "todos" || card.dataset.normalizedTopic === activeTopic;
      return topicMatches && card.dataset.searchText.includes(query);
    });

  const render = () => {
    const results = matches();
    const visible = Math.min(visibleCount, results.length);

    cards.forEach((card) => {
      card.hidden = true;
    });
    results.slice(0, visible).forEach((card) => {
      card.hidden = false;
    });

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
      const correction = after - before;
      if (Math.abs(correction) > 1) window.scrollBy(0, correction);
    });
  };

  moreButton?.addEventListener("click", () => {
    visibleCount += pageSize();
    render();
  });

  lessButton?.addEventListener("click", () => {
    preserveControlsPosition(() => {
      visibleCount = Math.max(pageSize(), visibleCount - pageSize());
    });
  });

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeTopic = normalize(button.dataset.insolvencyFilter);
      visibleCount = pageSize();
      filters.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });

  search?.addEventListener("input", () => {
    query = normalize(search.value);
    visibleCount = pageSize();
    render();
  });

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
