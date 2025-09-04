FROM node:20-alpine AS deps
WORKDIR /app
COPY gateway/package.json ./
RUN npm install --production

FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY gateway/ /app/
COPY proto/ /app/proto/
EXPOSE 8080
CMD ["node","index.js"]
