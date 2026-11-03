import { siteUrl } from "@/lib/config.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const body = [
      "User-agent: *",
      "Allow: /",
      "",
      `Sitemap: ${siteUrl(ctx.url)}/sitemap.xml`,
      "",
    ].join("\n");

    return new Response(body, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
});
