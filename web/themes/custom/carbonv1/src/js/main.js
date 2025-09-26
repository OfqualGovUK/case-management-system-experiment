import '../scss/main.scss';
// (Optional) add your own JS here
console.log('carbonv1 theme loaded');
// Accordion
import '@carbon/web-components/es/components/accordion/index.js';

// Date picker
import '@carbon/web-components/es/components/date-picker/index.js';

// Data table (core pieces)
import '@carbon/web-components/es/components/data-table/index.js';

// (Optional helpers)
import '@carbon/web-components/es/components/pagination/index.js';
// already importing your SCSS
import '../scss/main.scss';
 
// carbon elements used on this screen
import '@carbon/web-components/es/components/checkbox/index.js';
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/search/index.js';
// add pagination and sorting js
import '@carbon/web-components/es/components/pagination/index.js';
//import '@carbon/web-components/es/components/data-table/data-table-sort.js';
// tags (for filter chips, if needed)
import '@carbon/web-components/es/components/tag/index.js';

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