/**
* @file
* Ofqual Carbon behaviors.
*/
// Import the Carbon web components you need
import '@carbon/web-components/es/components/button/index.js';
import '@carbon/web-components/es/components/search/index.js';
import '@carbon/web-components/es/components/accordion/index.js';
import '@carbon/web-components/es/components/checkbox/index.js';
import '@carbon/web-components/es/components/date-picker/index.js';
(function (Drupal) {

  'use strict';

  Drupal.behaviors.ofqualCarbon = {
    attach (context, settings) {

      console.log('It works!');

    }
  };

} (Drupal));

// You can add more as needed, e.g.
// import '@carbon/web-components/es/components/ui-shell/index.js';
