FROM node:8.11.4-alpine

RUN mkdir -p /src

WORKDIR /src
ADD SimpleSSO-Server/* /src/
RUN npm install

EXPOSE 3001
CMD node /src/bin/www
