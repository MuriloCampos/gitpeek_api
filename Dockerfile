FROM node:12

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

ENV PORT=3333

CMD [ "yarn", "dev" ]