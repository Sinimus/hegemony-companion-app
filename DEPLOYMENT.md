# Deployment

## What the image is

The app is a static build served by nginx on port 80. The image lives at
`ghcr.io/sinimus/hegemony-companion-app`, tagged `latest` and with the short commit SHA.
A push to `main` builds and pushes it; pull requests run lint, type check, tests, a build
and a Docker build with a smoke test.

## Run the published image

```bash
docker run --rm -p 8080:80 ghcr.io/sinimus/hegemony-companion-app:latest
```

Then open <http://localhost:8080>.

## Build locally

```bash
pnpm install
pnpm dev       # development server
pnpm build     # static build into dist/
pnpm preview   # serve the build locally
```

Docker image from source: `docker build -t hegemony-companion .`

## Health check

The image declares a Docker `HEALTHCHECK` that requests `/`. An orchestrator can probe the
same path on port 80.

## Offline use

The app is a PWA: after the first visit it works without a network. A new version is picked
up on the next load.
