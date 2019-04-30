#!/bin/bash

set -a
. .env
set +a

if [ ! -n "$PORT" ]; then
  echo "Please set PORT value in .env file!"
  exit 1
fi

echo "Waiting for PowerCMS start on port $PORT..."

while ! nc -z localhost $PORT; do
  sleep 0.1
done

docker-compose run --rm services bash -c "npm run seeds"
