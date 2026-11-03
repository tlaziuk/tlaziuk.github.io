import { config, siteUrl } from "@/lib/config.ts";
import { define } from "@/utils.ts";

export default define.page(function App({ Component, url }) {
  const canonical = `${siteUrl(url)}/`;

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{config.name}</title>
        <meta name="description" content={config.description} />
        <meta name="color-scheme" content="light dark" />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={config.name} />
        <meta property="og:title" content={config.name} />
        <meta property="og:description" content={config.description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={config.name} />
        <meta name="twitter:description" content={config.description} />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#121212"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body class="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <Component />
      </body>
    </html>
  );
});
