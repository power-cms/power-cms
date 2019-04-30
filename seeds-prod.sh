#!/bin/sh

set -a
. .env
set +a

echo "Waiting for PowerCMS start on port $PORT..."

while ! nc -z api $PORT; do
  sleep 0.1
done

SERVICEDIR=dist/seeds ./node_modules/.bin/moleculer-runner --config dist/moleculer.config.js
