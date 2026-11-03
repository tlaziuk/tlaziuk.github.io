import { siteUrl } from "@/lib/config.ts";
import { revision } from "@/lib/revision.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl(ctx.url)}/</loc>
    <lastmod>${revision.builtAtIso.slice(0, 10)}</lastmod>
  </url>
</urlset>
`;

    return new Response(body, {
      headers: { "content-type": "application/xml; charset=utf-8" },
    });
  },
});
