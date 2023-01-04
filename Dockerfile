FROM node:16.14-buster-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn add npm@9.2.0 --force
#RUN yarn add --force

RUN yarn install --pure-lockfile
RUN yarn add sharp --ignore-scripts=false

# Add libvips
#RUN apk add --upgrade --no-cache vips-dev build-base --repository https://alpine.global.ssl.fastly.net/alpine/v3.10/community/

# Install Dependencies
RUN yarn install --production --ignore-optional --ignore-scripts --pure-lockfile --non-interactive

RUN yarn add  --ignore-scripts=false --foreground-scripts --v

RUN yarn add --platform=linuxmusl --arch=x64 sharp

COPY . .

CMD ["node", "dist/main"]
