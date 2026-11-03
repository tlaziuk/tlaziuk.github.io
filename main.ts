import { App, staticFiles } from "fresh";
import { resolveLocale } from "@/lib/locale.ts";
import { define, type State } from "@/utils.ts";

export const app = new App<State>();

app.use(staticFiles());

const resolveRequestLocale = define.middleware((ctx) => {
  ctx.state.locale = resolveLocale(ctx.req.headers.get("accept-language"));
  return ctx.next();
});

app.use(resolveRequestLocale);
app.fsRoutes();
