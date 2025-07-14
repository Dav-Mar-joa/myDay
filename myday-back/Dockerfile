# 1 - Builder Step
FROM node:22-alpine AS builder

WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build:production

# Image Production
FROM node:22-alpine

WORKDIR /app

# Copy package and dev
COPY package*.json ./

RUN npm ci --omit=dev
COPY dist/ ./dist

CMD ["node", "dist/index.js"]