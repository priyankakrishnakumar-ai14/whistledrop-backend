
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
