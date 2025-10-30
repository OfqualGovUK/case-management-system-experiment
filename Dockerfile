FROM public.ecr.aws/bitnami/drupal:11.2.5

COPY composer.json composer.lock /app/
COPY web/themes/custom /app/web/themes/custom

USER root
RUN mkdir -p /app/vendor && chown -R 1001:0 /app
USER 1001

RUN cd /app && composer install --no-dev --no-interaction