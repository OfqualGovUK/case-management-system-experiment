FROM crofqappdev1.azurecr.io/ofqual/drupal-bitnami:latest

COPY composer.json composer.lock /app/
COPY web/themes/custom /app/web/themes/custom

USER root
RUN mkdir -p /app/vendor && chown -R 1001:0 /app
USER 1001

RUN cd /app && composer install --no-dev --no-interaction