FROM node:10 as dev

ENV NODE_ENV=development

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install
CMD ["npm", "run", "dev"]


FROM node:10-alpine as prod

ENV NODE_ENV=production

COPY --from=dev . .

RUN npm run build && npm prune
CMD ["npm", "start"]
