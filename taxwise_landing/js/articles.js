import { qs, qsa, formatDate } from "./utils.js";

const MOBILE_BREAKPOINT = window.matchMedia("(max-width: 639px)");
const MOBILE_PAGE_SIZE = 3;

function articleCardHtml(a, locale) {
  return `<article class="card reveal">
          <div class="article-meta">
            <span class="tag">${a.categoryLabel}</span>
            <time class="article-date" datetime="${a.date}">${formatDate(a.date, locale)}</time>
          </div>
          <h3>${a.title}</h3>
          <p>${a.excerpt}</p>
        </article>`;
}

export function renderArticles(content) {
  const grid = qs("#article-grid");
  const filters = qs("#article-filters");
  if (!grid || !filters) return;

  const items = content.articleItems;
  const locale = content.site.locale;
  const loadWrap = qs("#article-load-more-wrap");
  const loadBtn = qs("#article-load-more");
  const loadMoreLabel = content.articles.loadMoreLabel || "Muat lagi";

  if (loadBtn) {
    loadBtn.textContent = loadMoreLabel;
    loadBtn.setAttribute("aria-controls", "article-grid");
  }

  filters.innerHTML = content.articles.filters
    .map(
      (f, i) =>
        `<button type="button" class="chip" data-filter="${f.id}" aria-pressed="${i === 0}">${f.label}</button>`
    )
    .join("");

  let currentFilter = "all";
  let mobileVisibleCount = MOBILE_PAGE_SIZE;
  let wasMobile = MOBILE_BREAKPOINT.matches;

  const paint = (filter) => {
    currentFilter = filter;
    const visible = items.filter((a) => filter === "all" || a.category === filter);
    const isMobile = MOBILE_BREAKPOINT.matches;
    const shown = isMobile ? visible.slice(0, mobileVisibleCount) : visible;
    grid.innerHTML = shown.map((a) => articleCardHtml(a, locale)).join("");

    if (loadWrap) {
      loadWrap.hidden = !(isMobile && mobileVisibleCount < visible.length);
    }
  };

  paint("all");

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    qsa("[data-filter]", filters).forEach((b) =>
      b.setAttribute("aria-pressed", String(b === btn))
    );
    mobileVisibleCount = MOBILE_PAGE_SIZE;
    paint(btn.dataset.filter);
  });

  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      mobileVisibleCount += MOBILE_PAGE_SIZE;
      paint(currentFilter);
    });
  }

  const onBreakpoint = () => {
    const isMobile = MOBILE_BREAKPOINT.matches;
    if (isMobile === wasMobile) return;
    wasMobile = isMobile;
    mobileVisibleCount = MOBILE_PAGE_SIZE;
    paint(currentFilter);
  };

  if (typeof MOBILE_BREAKPOINT.addEventListener === "function") {
    MOBILE_BREAKPOINT.addEventListener("change", onBreakpoint);
  } else {
    MOBILE_BREAKPOINT.addListener(onBreakpoint);
  }
}
