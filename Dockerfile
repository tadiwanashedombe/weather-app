FROM php:8.3-apache
RUN docker-php-ext-install curl
COPY . /var/www/html/
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader
RUN a2enmod rewrite
EXPOSE 80