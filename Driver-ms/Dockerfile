FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p dist

RUN npm install -g typescript

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "start"]