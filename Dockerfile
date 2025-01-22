# Build PHP dependencies using Composer (multi-stage)
FROM composer:2.7.7 as vendor

WORKDIR /app
COPY ./composer.json /app/composer.json
COPY ./composer.lock /app/composer.lock
RUN composer install --ignore-platform-reqs --no-interaction --no-plugins --no-scripts --prefer-dist

# Set the base image for PHP with Apache
FROM php:8.3.6-apache

ENV HTTP_LOCAL_CONF loanify.local.conf

# Install necessary PHP extensions and cron
RUN apt-get update && apt-get install -y \
  libpng-dev libjpeg-dev libfreetype6-dev zip git libzip-dev cron \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install gd zip pdo pdo_mysql bcmath opcache

# Install Node.js 22 and npm
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs

# Install Supervisor
RUN apt-get install -y \
    supervisor \
    tmux \
    vim

COPY ./playbook/httpd_conf/$HTTP_LOCAL_CONF /etc/apache2/sites-available/

# Enable Apache mod_rewrite for Laravel
RUN a2enmod rewrite headers && service apache2 restart
RUN a2dissite 000-default.conf && a2ensite $HTTP_LOCAL_CONF

# Set the working directory to /app
WORKDIR /app

# Copy the Laravel application into the container
COPY . /app

# Copy the vendor directory from the 'vendor' build stage
COPY --from=vendor /app/vendor /app/vendor

# Install Composer and Node dependencies (inside the container)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
  && composer install --no-dev --optimize-autoloader \
  && npm install

# Cron configuration (uncomment if needed)
COPY --chmod=644 ./playbook/cron/scheduler /etc/cron.d/scheduler
RUN crontab -u www-data /etc/cron.d/scheduler

COPY --chown=www-data:www-data . /app

# Expose necessary ports for Nginx and PHP
EXPOSE 80 443

# Copy supervisor configuration
COPY ./playbook/supervisor/supervisord.conf /etc/supervisord.conf

# Start Supervisor to run multiple processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
