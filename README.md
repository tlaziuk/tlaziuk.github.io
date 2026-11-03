# tlaziuk.github.io

Personal landing page: a single server-rendered page with links to email,
GitHub, Twitter and LinkedIn, plus a footer showing the deployed revision.

## About this document

Everything in this file is project and application specific knowledge for humans
and agents to use. Try to keep this document up-to-date with the current state
of the project.

`AGENTS.md` and `CLAUDE.md` are symlinks to the `README.md` file, so the hints
live in one place.

## How it works

The site runs on [Deno](https://deno.com) with [Fresh 2](https://usefresh.dev)
and is built with Vite. Everything is rendered on the server; the browser
receives HTML and CSS only.

- **No client JavaScript.** There is no `islands/` directory and `client.ts`
  only imports stylesheets. Fresh injects its runtime `<script>` only for
  islands, `<Partial>` regions or client-side navigation, so a page made of
  plain components ships none. Keep it that way: adding an island, a `f-partial`
  region or `f-client-nav` reintroduces the runtime.
- **Styling** is Tailwind CSS v4, wired through its Vite plugin.
  `assets/styles.css` is the single entry point and holds the `@theme` overrides
  (currently the font family). Prefer Tailwind utilities in markup over new CSS.
- **Dark mode** follows the OS setting through Tailwind's `dark:` variant, which
  is driven by `prefers-color-scheme`. There is no theme switch and no stored
  preference, so the page needs no JavaScript to pick a theme.
- **Fonts** are Roboto, self-hosted as woff2 from `@fontsource-variable/roboto`
  and imported by `client.ts`, so no request goes to a font CDN.
- **Icons** come from `@iconify-json/mdi`; `components/icon.tsx` inlines the
  icon body as SVG while rendering on the server, so icons cost no requests and
  no JavaScript.
- **Revision footer** is resolved once at startup: `GIT_REVISION` first, then
  `git rev-parse`, then the `.git` metadata (loose refs and `packed-refs`), then
  `unknown`. `BUILD_TIMESTAMP` is formatted with `Temporal` and
  `Intl.DateTimeFormat` in UTC.

## Discoverability and accessibility

- `routes/_app.tsx` emits the description, canonical URL, Open Graph and Twitter
  card metadata. `APP_URL` keeps those absolute URLs correct behind a proxy;
  without it the incoming request origin is used.
- `routes/robots.txt.ts` and `routes/sitemap.xml.ts` are generated from the same
  origin, so crawlers only ever see absolute URLs.
- There is no client-side analytics by design: the page loads no JavaScript, so
  server access logs are the source of traffic data.
- Profile links carry `rel="me"` and external links announce that they open a
  new tab for screen readers.
- The page keeps one `<h1>`, `header`/`nav`/`main`/`footer` landmarks, visible
  focus outlines, AA contrast in both colour schemes and a `<time datetime>` for
  the build timestamp. `color-scheme: light dark` keeps native UI in sync.

## Layout

| Path                    | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `main.ts`               | Fresh app: static file middleware and file-system routes  |
| `utils.ts`              | `define` helpers with the `ctx.state` type                |
| `client.ts`             | Stylesheet-only Vite client entry (no runtime code)       |
| `assets/styles.css`     | Tailwind import and `@theme` tokens                       |
| `routes/_app.tsx`       | `<html>` shell: metadata, theme-color, body classes       |
| `routes/index.tsx`      | The page itself                                           |
| `routes/health.ts`      | `GET /health` → empty `204` for the container healthcheck |
| `routes/robots.txt.ts`  | Crawler rules plus the absolute sitemap URL               |
| `routes/sitemap.xml.ts` | Single-entry sitemap                                      |
| `components/`           | Server components (icon rendering, social links)          |
| `lib/`                  | Environment configuration and revision lookup             |
| `static/`               | Files served as-is (favicon)                              |

## Configuration

All configuration is read from the environment at startup; links without a value
are not rendered at all.

| Variable           | Default              | Purpose                                     |
| ------------------ | -------------------- | ------------------------------------------- |
| `APP_NAME`         | `Tomek Łaziuk`       | Page title                                  |
| `APP_EMAIL`        | unset                | Renders the `mailto:` link                  |
| `APP_GITHUB_URL`   | unset                | GitHub profile URL                          |
| `APP_TWITTER_URL`  | unset                | Twitter profile URL                         |
| `APP_LINKEDIN_URL` | unset                | LinkedIn profile URL                        |
| `APP_URL`          | request origin       | Origin for canonical links, robots, sitemap |
| `APP_DESCRIPTION`  | built-in sentence    | Meta description for search and previews    |
| `GIT_REVISION`     | detected from `.git` | Commit hash shown in the footer             |
| `BUILD_TIMESTAMP`  | server start time    | ISO 8601 instant or epoch milliseconds      |

Copy `.env.example` to `.env` for local development; `.env` is gitignored and is
loaded automatically by `deno task start`.

## Commands

```sh
deno install            # install dependencies (deno.lock is committed)
deno task dev           # dev server with HMR
deno task build         # production build into _fresh/
deno task start         # serve the build on http://localhost:8000
deno task check         # deno fmt --check, deno lint, deno check
```

`deno task dev` does not read `.env` by itself; pass it explicitly when you want
the configured links locally:

```sh
deno task --env-file .env dev
```

Formatting and linting use Deno defaults (no Prettier/ESLint config); `deno fmt`
is the formatter of record. `LICENSE.md` is the only file excluded from
`deno fmt`, so the licence text stays byte-for-byte as written.

## Docker

The image builds the site and serves it from the same layer, so it needs no
build step on the host:

```sh
docker build -t tlaziuk-site .
docker run -d --name tlaziuk-site -p 8000:8000 --env-file .env tlaziuk-site
```

- The container always listens on port `8000`; map it to whatever the host
  needs.
- The revision needs no build argument: `.dockerignore` keeps `.git/HEAD`,
  `.git/refs` and `.git/packed-refs` in the build context (objects, logs and
  hooks stay out), so the footer shows the built commit on its own. Setting
  `GIT_REVISION` still overrides it, which is useful when the build comes from a
  tarball without git metadata.
- The base image is `denoland/deno:2.9.8` (Debian). The Alpine variant is far
  smaller, but `deno task build` fails there: Tailwind's native scanner
  (`@tailwindcss/oxide`) cannot load a matching native binding on that image
  ("Cannot find native binding"). A shell-compatibility workaround is not worth
  it for this site.
- `HEALTHCHECK` polls `/health` with `deno eval`, since the Deno image ships no
  `curl` or `wget`; the endpoint answers with an empty `204`.
