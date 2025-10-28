FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock tsconfig.base.json ./
COPY packages/workers/package.json ./packages/workers/
COPY packages/shared/package.json ./packages/shared/

RUN yarn install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY packages/workers ./packages/workers

RUN yarn build

FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/workers/package.json ./packages/workers/
COPY packages/shared/package.json ./packages/shared/

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/workers/dist ./packages/workers/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/workers/package.json ./packages/workers/

WORKDIR /app/packages/workers

CMD ["node", "dist/main.js"]
