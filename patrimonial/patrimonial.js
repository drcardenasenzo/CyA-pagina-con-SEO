(() => {
  const getSlug = (img) => {
    const card = img.closest("a.article-card");
    const source = card?.getAttribute("href") || window.location.pathname;
    return source.split("?")[0].split("/").filter(Boolean).pop();
  };

  document.querySelectorAll("img[data-article-image]").forEach((img) => {
    const slug = getSlug(img);
    if (!slug) return;
    img.dataset.articleImage = `/patrimonial/assets/img/articles/${slug}.jpg`;
    img.dataset.pendingImage = "/assets/img/placeholders/article-pending.svg";
    img.dataset.failed = "";
    img.classList.remove("image-missing");
    img.src = img.dataset.articleImage;
  });
})();
