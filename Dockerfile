# Debian rather than Alpine: the Alpine image runs a glibc Deno, and Tailwind's
# native scanner (@tailwindcss/oxide) cannot load a matching binding there —
# `deno task build` fails with "Cannot find native binding". The runtime needs
# only the JS bundle, but the build has to happen in the same stage.
FROM denoland/deno:2.9.8

WORKDIR /app

COPY . .
# Everything the server needs ends up bundled in `_fresh/`, so the dependencies
# and module caches used to build it are dropped from the final layer. `.git`
# keeps only HEAD/refs (objects are excluded in .dockerignore), which is what the
# footer reads to show the deployed revision.
RUN deno install --frozen-lockfile \
  && deno task build \
  && rm -rf node_modules /deno-dir/*

USER deno

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["deno", "eval", "const res = await fetch('http://127.0.0.1:8000/health'); Deno.exit(res.ok ? 0 : 1);"]

# `deno serve` does not read PORT, so the container always listens on 8000.
CMD ["serve", "-A", "_fresh/server.js"]
