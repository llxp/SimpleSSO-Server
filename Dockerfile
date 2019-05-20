FROM node:8.11.4-alpine

#RUN apk update \
#    && apk add openssl

RUN mkdir -p /src

WORKDIR /src
COPY SimpleSSO-Server/ /src/
RUN npm install
#RUN ls certs/
#RUN cd certs && node create_certs.js --opensslPath /usr/bin/openssl

EXPOSE 3001
CMD export DEBUG=simplesso-server:* && node bin/www
