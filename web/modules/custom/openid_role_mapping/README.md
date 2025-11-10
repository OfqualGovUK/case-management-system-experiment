# OpenId Role Mapping Module

## INTRODUCTION

This module extends the functionality of the OpenID Connect module in Drupal by allowing automatic role assignment based on claims received from the identity provider.

## FEATURES

- Maps external roles from OpenID Connect claims to Drupal roles.
- Supports nested claim structures.
- Configurable claim name and role mapping

## REQUIREMENTS

* Drupal 11 core
* PHP 8.2 or higher
* https://www.drupal.org/project/openid_connect

## INSTALLATION

Install the Cases module using a standard Drupal installation method.

1. Place the 'cases' module in your Drupal installation under
   '/modules/custom/'.
2. Enable the module via the UI or Drush:

   drush en openid_role_mapping -y
   drush cr

## MAINTAINERS

* Module: OpenId Role Mapping
* Maintainer: Ofqual Drupal Team
* License: GNU General Public License v2 or later
