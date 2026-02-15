FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY docs ./docs

ENV NODE_ENV=production
ENV PORT=7100

EXPOSE 7100

CMD ["node", "dist/server/index.js"]
