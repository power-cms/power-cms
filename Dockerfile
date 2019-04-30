FROM node:10 as dev

ENV NODE_ENV=development

RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install
CMD ["npm", "run", "dev"]


FROM node:10-alpine as prod

ENV NODE_ENV=production
ENV NAMESPACE=
ENV LOGGER=true
ENV LOGLEVEL=info
ENV SERVICEDIR=dist/services
ENV PORT=3000
ENV TRANSPORTER=nats://nats:4222
ENV DB_HOST=mongodb
ENV DB_PORT=27017
ENV DB_DATABASE=power_cms

RUN mkdir /app
WORKDIR /app

COPY --from=dev /app .

RUN npm run build && npm prune
CMD ["npm", "start"]
