FROM node:lts-alpine3.17 AS node-restore

WORKDIR /assets

COPY ["./web/package.json", "./web/package-lock.json", "./"]
RUN npm ci --prefer-offline --no-audit --progress=false

FROM node-restore AS web-build

COPY ./web/tailwind.config.js ./
COPY ./web/src/ ./src/
COPY ./web/public/ ./public/
RUN npm run build

FROM golang:1.17-alpine AS go-build

WORKDIR /assets

COPY ["go.mod", "go.sum", "./"]
RUN go mod download

COPY ./cmd/ ./cmd/
COPY ./web/*.go ./web/
COPY --from=web-build /assets/public/ ./web/public/
COPY --from=web-build /assets/src/ ./web/src/

RUN --mount=type=cache,target=/build/.cache/go-build CGO_ENABLED=0 GOOS=linux go build -o ./build/app.out cmd/app/main.go

FROM alpine:3.16
ENV PORT 8080

WORKDIR /app

COPY --from=go-build /assets/build/app.out .
ENTRYPOINT ["./app.out"]