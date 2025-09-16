<?php

declare(strict_types=1);

/**
 * @file
 * Theme settings form for carbondrupalofqual theme.
 */

use Drupal\Core\Form\FormState;

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function carbondrupalofqual_form_system_theme_settings_alter(array &$form, FormState $form_state): void {

  $form['carbondrupalofqual'] = [
    '#type' => 'details',
    '#title' => t('carbondrupalofqual'),
    '#open' => TRUE,
  ];

  $form['carbondrupalofqual']['example'] = [
    '#type' => 'textfield',
    '#title' => t('Example'),
    '#default_value' => theme_get_setting('example'),
  ];

}
