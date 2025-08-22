FROM node:22-alpine

ENV NODE_VERSION 20.16.0

WORKDIR  /user/src/redisbe

COPY . .

RUN npm install

CMD ["npm","start"]

