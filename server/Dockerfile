FROM node:14

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./
COPY .env ./

RUN yarn install

COPY dist .

EXPOSE 3000

CMD ["node", "index.js"]
