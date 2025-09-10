FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY packages/workers ./packages/workers

RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /app/packages/workers

CMD ["node", "dist/main.js"]

