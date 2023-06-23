FROM php:7.4.6-apache

RUN apt-get update && \
    apt-get install -y libzip-dev && \
    rm -rf /var/lib/apt/lists/*


RUN if [ ${PUID:-0} -ne 0 ] && [ ${PGID:-0} -ne 0 ]; then \
    userdel -f www-data &&\
    if getent group www-data ; then groupdel www-data; fi &&\
    groupadd -g ${PGID} www-data &&\
    useradd -l -u ${PUID} -g www-data www-data; fi &&\
    docker-php-ext-install mysqli pdo pdo_mysql zip

# Setup needed php extensions
#RUN docker-php-ext-install mysqli pdo pdo_mysql zip
