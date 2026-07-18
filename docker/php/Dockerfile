FROM php:8.4-fpm

# Laravelを動かすために必要なPHP拡張機能をビルドするための下準備
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# composerコマンドをこのイメージにコピーして使えるようにする
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 自分で用意したphp.ini（タイムゾーンやアップロードサイズ設定など）を反映する
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

WORKDIR /var/www/html
