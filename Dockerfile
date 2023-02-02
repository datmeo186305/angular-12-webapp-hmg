##############################
#           BUILD
##############################
FROM node:12-alpine as BUILD

#Install java to run  openapi-generator-cli
RUN apk update && apk add openjdk8-jre && rm -rf /var/lib/apt/lists/*

ARG ENV_TYPE

WORKDIR /usr/src/app/

COPY package*.json ./

COPY yarn.lock ./



#Run openapi-generator-cli to generate openapi
COPY openapitools.json ./

COPY open-api-yaml ./open-api-yaml

COPY generate-openapi.sh ./

RUN yarn global add @openapitools/openapi-generator-cli@2.4.2 -D

RUN /bin/sh -c "source /usr/src/app/generate-openapi.sh"




WORKDIR /usr/src/app/

RUN yarn install

COPY . .

RUN yarn build --configuration $ENV_TYPE

##############################
#           PRODUCTION
##############################
FROM nginx:1.20.0-alpine as production

RUN apk add --update coreutils

# Add a user how will have the rights to change the files in code
RUN addgroup -g 1500 nginxusers
RUN adduser --disabled-password -u 1501 nginxuser nginxusers

# Configure ngnix server
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /code
COPY --from=BUILD /usr/src/app/dist/monex-webapp-hmg .

WORKDIR /
COPY docker_entrypoint.sh .

RUN chown nginxuser:nginxusers docker_entrypoint.sh
RUN chown -R nginxuser:nginxusers /code
RUN chown -R nginxuser:nginxusers /etc/nginx
RUN chown -R nginxuser:nginxusers /tmp
RUN chown -R nginxuser:nginxusers /var
RUN chmod 777 /code
RUN chmod 777 /tmp
RUN chmod 777 /etc/nginx
RUN chmod 777 /var

USER nginxuser

EXPOSE 8080:8080
CMD ["/bin/sh","docker_entrypoint.sh"]
