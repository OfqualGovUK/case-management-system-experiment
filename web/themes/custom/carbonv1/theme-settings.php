<?php

declare(strict_types=1);

/**
 * @file
 * Theme settings form for carbonv1 theme.
 */

use Drupal\Core\Form\FormState;

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function carbonv1_form_system_theme_settings_alter(array &$form, FormState $form_state): void {

  $form['carbonv1'] = [
    '#type' => 'details',
    '#title' => t('carbonv1'),
    '#open' => TRUE,
  ];

  $form['carbonv1']['example'] = [
    '#type' => 'textfield',
    '#title' => t('Example'),
    '#default_value' => theme_get_setting('example'),
  ];

}
