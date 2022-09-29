FROM node:16.14-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install npm@8.19.2 --force
RUN npm install --force

COPY . .

CMD ["node", "dist/main"]
