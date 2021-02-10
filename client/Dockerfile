FROM node:14 AS client

WORKDIR /client

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
COPY .env ./.env
COPY ./dist ./dist

RUN yarn install

#Second stage for nginx server

FROM nginx:alpine

WORKDIR /usr/share/nginx/html
# Delete sample nginx web server files
RUN rm -rf ./*

COPY --from=client /client/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]


