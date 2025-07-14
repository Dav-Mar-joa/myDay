# Project

# Database - Mongodb

## Start
```sh
docker compose up -d
```

## Stop
```sh
docker compose down -v
```

# Build
```sh
npm ci && npm run build
```

# Docker
## Build
```sh
docker build -t myday:latest .
```

## Run
```sh
docker run --env-file dev.env myday
```

# Docker compose
```sh
docker-compose up
```