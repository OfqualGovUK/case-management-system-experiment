(function () {
  const Q  = (s, el = document) => el.querySelector(s);
  const QA = (s, el = document) => Array.from(el.querySelectorAll(s));
  const ROWS = w => QA('cds-table-body > cds-table-row', w);
  const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
 
  // ---------- PAGINATION  ----------
  function applyPagination(wrap) {
    if (wrap.dataset.paginated === '0') return;
    const pager = Q('cds-pagination', wrap);
    if (!pager) return;
 
    const all = ROWS(wrap);
    const total = all.length;
 
    const pageSize =
      Number(pager.pageSize ?? pager.getAttribute('page-size') ??
             wrap.getAttribute('data-page-size') ?? 10);
 
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    let page = Number(pager.page ?? pager.getAttribute('page') ?? 1);
    page = clamp(page, 1, totalPages);
 
    // Keep the pagination component in sync
    if (String(pager.getAttribute('total-items')) !== String(total)) {
      pager.setAttribute('total-items', String(total));
    }
    if ((pager.page ?? null) !== page) {
      pager.setAttribute('page', String(page));
    }
 
    // Hide all rows, then show only the current page slice
    all.forEach(r => { r.hidden = true; });
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    all.slice(start, end).forEach(r => { r.hidden = false; });
 
    // Optional "empty" state (if you render one)
    const empty = Q('.cds-table-empty', wrap);
    if (empty) empty.hidden = total !== 0;
  }
 
  function initOne(wrap) {
    // Initial paint
    requestAnimationFrame(() => applyPagination(wrap));
 
    // Hook up pager events (covers both cds- and older bx- events)
    const pager = Q('cds-pagination', wrap);
    if (!pager) return;
 
    const rerender = () => applyPagination(wrap);
 
    [
      'cds-pagination-changed-current',
      'cds-pagination-changed-page-size',
      'bx-pagination-changed-current',
      'bx-pagination-changed-page-size',
      'change',
      'input',
    ].forEach(evt => pager.addEventListener(evt, rerender, { passive: true }));
 
    // React to attribute changes (e.g., if page/page-size set programmatically)
    new MutationObserver(muts => {
      if (muts.some(m => m.attributeName === 'page' || m.attributeName === 'page-size')) {
        rerender();
      }
    }).observe(pager, { attributes: true, attributeFilter: ['page', 'page-size'] });
 
    // Safety: clicks that mutate internals
    pager.addEventListener('click', () => requestAnimationFrame(rerender), { passive: true });
  }
 
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-cds-datatable]').forEach(initOne);
  });
})();