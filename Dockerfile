FROM denoland/deno:2.9.8

ARG GIT_REVISION=unknown

WORKDIR /app

COPY . .
# Everything the server needs is bundled into `_fresh/`, so the dependencies and
# module caches used to build it are dropped from the final layer.
RUN deno install --frozen-lockfile \
  && deno task build \
  && rm -rf node_modules /deno-dir/*

# Baked into the image so the page footer can show the revision while the build
# keeps `.git` out of the image. It must match the value used by the build for
# Fresh's asset cache-busting to stay stable.
ENV GIT_REVISION=${GIT_REVISION}

USER deno

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["deno", "eval", "--allow-net", "const res = await fetch('http://127.0.0.1:8000/health'); if (!res.ok) Deno.exit(1); await res.body?.cancel();"]

# `deno serve` does not read PORT, so the container always listens on 8000.
CMD ["serve", "-A", "_fresh/server.js"]
