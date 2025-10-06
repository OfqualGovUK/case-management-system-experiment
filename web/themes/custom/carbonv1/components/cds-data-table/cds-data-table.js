(function () {
    const Q = (s, el = document) => el.querySelector(s);
    const QA = (s, el = document) => Array.from(el.querySelectorAll(s));
    const ROWS = w => QA('cds-table-body > cds-table-row', w);
    const HEADER_SEL = 'cds-table-header[data-sortable], cds-table-header-cell[data-sortable]';
    const ICONS = {
        none: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 16" fill="currentColor" aria-hidden="true" width="2em" height="1em">
    <g transform="translate(3, 0)">
        <path d="M3.7 6.7L7.5 2.9 7.5 15 8.5 15 8.5 2.9 12.3 6.7 13 6 8 1 3 6z"/>
    </g>
    <g transform="translate(13, 0)">
        <path d="M12.3 9.3L8.5 13.1 8.5 1 7.5 1 7.5 13.1 3.7 9.3 3 10 8 15 13 10z"/>
    </g>
</svg>
`,
        ascending: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="2em" height="1em">
    <path d="M3.7 6.7L7.5 2.9 7.5 15 8.5 15 8.5 2.9 12.3 6.7 13 6 8 1 3 6z"/>
</svg>
`,
        descending: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="2em" height="1em">
    <path d="M12.3 9.3L8.5 13.1 8.5 1 7.5 1 7.5 13.1 3.7 9.3 3 10 8 15 13 10z"/>
</svg>
`
    };

    // ---------- ICONS ----------
    function paintIcon(th) {
        let icon = th.querySelector('.cds-sort-icon');
        if (!icon) {
            icon = document.createElement('span');
            icon.className = 'cds-sort-icon';
            icon.setAttribute('aria-hidden', 'true');
            th.appendChild(icon);
        }
        const state = th.getAttribute('aria-sort') || 'none';
        icon.innerHTML = ICONS[state] || ICONS.none;
    }
    function updateSortIcons(wrap) {
        QA(HEADER_SEL, wrap).forEach(paintIcon);
    }

    // ---------- SEARCH ----------
    function applySearch(wrap) {
        const search = Q('cds-table-toolbar-search[data-filter], cds-search[data-filter]', wrap);
        const q = search
            ? (search.value ?? search.shadowRoot?.querySelector('input')?.value ?? '').trim().toLowerCase()
            : '';
        let visible = 0;
        ROWS(wrap).forEach(row => {
            const hay = QA('cds-table-cell', row).map(c => c.textContent.trim().toLowerCase()).join(' ');
            const hide = !!q && !hay.includes(q);
            row.classList.toggle('is-filter-hidden', hide);
            if (!hide) visible++;
        });
        Q('.cds-table-empty', wrap)?.toggleAttribute('hidden', visible !== 0);
        wrap.dataset.visibleCount = String(visible);
    }

    // ---------- PAGINATION ----------
    function applyPagination(wrap) {
        if (wrap.dataset.paginated === '0') return;
        const pager = Q('cds-pagination', wrap);
        if (!pager) return;
        const page = Number(pager.getAttribute('page') || 1);
        const pageSize = Number(pager.getAttribute('page-size') || wrap.getAttribute('data-page-size') || 10);

        const all = ROWS(wrap);
        const vis = all.filter(r => !r.classList.contains('is-filter-hidden'));
        pager.setAttribute('total-items', String(vis.length));

        all.forEach(r => r.classList.add('is-page-hidden'));
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        vis.slice(start, end).forEach(r => r.classList.remove('is-page-hidden'));

        all.forEach(r => {
            const hide = r.classList.contains('is-filter-hidden') || r.classList.contains('is-page-hidden');
            r.hidden = hide;
            r.style.display = hide ? 'none' : '';
        });
    }

    // ---------- SORT ----------
    function parseByType(text, type) {
        const t = (text ?? '').trim();
        if (type === 'number') return parseFloat(t.replace(/[^0-9.\-]/g, '')) || 0;
        if (type === 'date') {
            const ts = Date.parse(t);
            return Number.isNaN(ts) ? 0 : ts;
        }
        return t.toLowerCase();
    }

    function sortRows(wrap, colIdx, dir) {
        const body = Q('cds-table-body', wrap);
        const colTypes = JSON.parse(wrap.getAttribute('data-coltypes') || '[]');
        const type = colTypes[colIdx] || 'string';

        const all = ROWS(wrap);
        const getCell = r => (QA('cds-table-cell', r)[colIdx]?.textContent ?? '');
        all.sort((a, b) => {
            const av = parseByType(getCell(a), type);
            const bv = parseByType(getCell(b), type);
            if (av < bv) return dir === 'asc' ? -1 : 1;
            if (av > bv) return dir === 'asc' ? 1 : -1;
            return (Number(a.dataset._idx) || 0) - (Number(b.dataset._idx) || 0);
        });

        const frag = document.createDocumentFragment();
        all.forEach(r => frag.appendChild(r));
        body.appendChild(frag);
    }

    // ---------- INIT ----------
    function initOne(wrap) {
        // remember original order for stable sort
        ROWS(wrap).forEach((r, i) => { r.dataset._idx = i; });

        requestAnimationFrame(() => {
            applySearch(wrap);
            applyPagination(wrap);
            updateSortIcons(wrap);
        });

        // Search
        wrap.addEventListener('input', (e) => {
            if (!e.target.closest('cds-table-toolbar-search[data-filter], cds-search[data-filter]')) return;
            const pager = Q('cds-pagination', wrap);
            if (pager) pager.setAttribute('page', '1');
            applySearch(wrap);
            applyPagination(wrap);
        });

        // Sorting
        wrap.addEventListener('click', (e) => {
            const th = e.target.closest(HEADER_SEL);
            if (!th) return;
            const col = Number(th.getAttribute('data-col') || 0);
            const cur = th.getAttribute('aria-sort') || 'none';
            const next = cur === 'ascending' ? 'descending' : 'ascending';

            QA(HEADER_SEL, wrap).forEach(h => h.setAttribute('aria-sort', 'none'));
            th.setAttribute('aria-sort', next);

            sortRows(wrap, col, next === 'descending' ? 'desc' : 'asc');
            applyPagination(wrap);
            updateSortIcons(wrap);
        });

        // Pager listeners
        const pager = Q('cds-pagination', wrap);
        if (pager) {
            const rerender = () => applyPagination(wrap);
            new MutationObserver(muts => {
                if (muts.some(m => m.attributeName === 'page' || m.attributeName === 'page-size')) rerender();
            }).observe(pager, { attributes: true, attributeFilter: ['page', 'page-size'] });
            [
                'cds-pagination-changed-current',
                'cds-pagination-changed-page-size',
                'cds-pagination-changed',
                'bx-pagination-changed-current',
                'change',
                'input'
            ].forEach(evt => pager.addEventListener(evt, rerender, { passive: true }));
            pager.addEventListener('click', () => requestAnimationFrame(rerender), { passive: true });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-cds-datatable]').forEach(initOne);
    });

    // Client-side filter for Carbon <cds-table> using <cds-table-toolbar-search> or <cds-search>
    document.addEventListener('input', (e) => {
        const control = e.target.closest('cds-table-toolbar-search, cds-search');
        if (!control || !control.hasAttribute('data-filter')) return;

        const tableId = control.getAttribute('data-filter');
        const table = document.getElementById(tableId);
        if (!table) return;

        // Try to read the value from the component; fall back to inner <input>
        const q =
            (control.value ?? '') ||
            (control.shadowRoot && control.shadowRoot.querySelector('input')?.value) ||
            '';
        const needle = q.trim().toLowerCase();

        const rows = table.querySelectorAll('cds-table-body > cds-table-row');
        let visible = 0;

        rows.forEach((row) => {
            const hay = Array.from(row.querySelectorAll('cds-table-cell'))
                .map((c) => c.textContent.trim().toLowerCase())
                .join(' ');
            const show = !needle || hay.includes(needle);
            row.hidden = !show; // hide via the HTML 'hidden' attribute
            if (show) visible++;
        });

        // (Optional) you could show a "No results" message if visible === 0
    });
})();
