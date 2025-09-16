<?php

declare(strict_types=1);

/**
 * @file
 * Theme settings form for ofqualcarbon theme.
 */

use Drupal\Core\Form\FormState;

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function ofqualcarbon_form_system_theme_settings_alter(array &$form, FormState $form_state): void {

  $form['ofqualcarbon'] = [
    '#type' => 'details',
    '#title' => t('ofqualcarbon'),
    '#open' => TRUE,
  ];

  $form['ofqualcarbon']['example'] = [
    '#type' => 'textfield',
    '#title' => t('Example'),
    '#default_value' => theme_get_setting('example'),
  ];

}
