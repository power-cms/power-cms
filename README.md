![PowerCMS](docs/logo.png)

[![Build Status](https://travis-ci.com/power-cms/power-cms.svg?branch=master)](https://travis-ci.com/power-cms/power-cms)
[![Coverage Status](https://coveralls.io/repos/github/power-cms/power-cms/badge.svg)](https://coveralls.io/github/power-cms/power-cms)

> PowerCMS is a Domain Driven, CQRS based CMS project in Microservices architecture, written for developers. Good architecture, code quality and fancy technologies will be always on the first place!

## How to use?

```bash
git clone git@github.com:power-cms/power-cms.git
cd power-cms
cp .env.dist .env
docker-compose up
```

To run seeds, start the server, and then run the following command:
```bash
./seeds.sh
```

## Packages

* [Auth service](https://github.com/power-cms/auth-service) - handles authentication, authorization and user register/login
* [User service](https://github.com/power-cms/user-service) - handles all users actions
* [Site service](https://github.com/power-cms/site-service) - handles sites management, with their content and urls
* [Common package](https://github.com/power-cms/common) - base for all other packages

## How to test?

```bash
npm test
```

# Production

Here you have an example of production-ready docker-compose.yml file. It doesn't require cloning the repository, because it's fully dockerized.

```yaml
version: "3.4"

services:
  api:
    image: powercms/power-cms
    environment:
      SERVICES: api
    networks: ["power-cms"]
    depends_on: ["nats", "mongodb"]
    ports: ["3000:3000"]
    labels:
      - "traefik.enable=true"
      - "traefik.backend=api"
      - "traefik.port=3000"
      - "traefik.frontend.entryPoints=http"
      - "traefik.frontend.rule=PathPrefix:/"

  site:
    image: powercms/power-cms
    environment:
      SERVICES: site
    networks: ["power-cms"]
    depends_on: ["nats", "mongodb"]

  user:
    image: powercms/power-cms
    environment:
      SERVICES: user
    networks: ["power-cms"]
    depends_on: ["nats", "mongodb"]

  auth:
    image: powercms/power-cms
    environment:
      SERVICES: auth
      ACCESS_TOKEN_SECRET: power-cms-access
      REFRESH_TOKEN_SECRET: power-cms-refresh
    networks: ["power-cms"]
    depends_on: ["nats", "mongodb"]

  settings:
    image: powercms/power-cms
    environment:
      SERVICES: settings
    networks: ["power-cms"]
    depends_on: ["nats", "mongodb"]

  mongodb:
    image: mongo:4
    networks: ["power-cms"]

  nats:
    image: nats
    networks: ["power-cms"]

  traefik:
    image: traefik
    command: --web --docker --docker.domain=docker.localhost --logLevel=INFO --docker.exposedbydefault=false
    networks:
      - power-cms
    ports:
      - "4001:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /dev/null:/traefik.toml

networks:
  power-cms:
```

To run seed in production use this one-liner script while your app is started:
```bash
docker run --rm -it --network=${PWD##*/}_power-cms powercms/power-cms sh -c "sh ./seeds-prod.sh"
```

## License

Copyright &copy; 2019 by Szymon Piecuch under ISC license.
