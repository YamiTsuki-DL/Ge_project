FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/me', (r) => {if (r.statusCode !== 200 && r.statusCode !== 401) throw new Error(r.statusCode)})"

CMD ["node", "server.js"]
