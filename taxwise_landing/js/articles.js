import { qs, qsa, formatDate } from "./utils.js";

export function renderArticles(content) {
  const grid = qs("#article-grid");
  const filters = qs("#article-filters");
  if (!grid || !filters) return;

  const items = content.articleItems;
  const locale = content.site.locale;

  filters.innerHTML = content.articles.filters
    .map(
      (f, i) =>
        `<button type="button" class="chip" data-filter="${f.id}" aria-pressed="${i === 0}">${f.label}</button>`
    )
    .join("");

  const paint = (filter) => {
    const visible = items.filter((a) => filter === "all" || a.category === filter);
    grid.innerHTML = visible
      .map((a) => {
        const placeholder = a.placeholder
          ? `<span class="tag is-placeholder">Placeholder</span>`
          : "";
        return `<article class="card reveal">
          <div class="article-meta">
            <span class="tag">${a.categoryLabel}</span>
            ${placeholder}
            <time class="article-date" datetime="${a.date}">${formatDate(a.date, locale)}</time>
          </div>
          <h3>${a.title}</h3>
          <p>${a.excerpt}</p>
        </article>`;
      })
      .join("");
  };

  paint("all");

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    qsa("[data-filter]", filters).forEach((b) =>
      b.setAttribute("aria-pressed", String(b === btn))
    );
    paint(btn.dataset.filter);
  });
}
