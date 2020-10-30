FROM node:13

RUN npm i webpack-dev-server -g

WORKDIR /srv/app

ADD ./ /srv/app
