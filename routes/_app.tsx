import { define } from "@/utils.ts";
import { config } from "@/lib/config.ts";

export default define.page(function App({ Component }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{config.name}</title>
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
