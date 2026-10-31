# Deployment

## What the image is

The app is a static build served by nginx on port 80. The image lives at
`ghcr.io/sinimus/hegemony-companion-app`, tagged `latest` and with the short commit SHA.
Pull requests run lint, type check, tests, a build, a Docker build with a smoke test and a
Playwright browser test of that container: every screen in `e2e/routes.json` must render its
heading from the bundle without a JavaScript or console error, and the screen menu and the
player count must switch screens. A push to `main` runs the same checks first (`docker-build.yml`
calls `pr-checks.yml`) and only then builds, pushes and deploys the image.

The browser test runs locally against any running image: `pnpm exec playwright install chromium`
once, then `pnpm test:e2e` (base URL `http://localhost:8080`, `E2E_BASE_URL` overrides).

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
