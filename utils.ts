import { createDefine } from "fresh";

/**
 * Data shared between middlewares and routes for a single request. The locale
 * is resolved once from `Accept-Language` so every component formats the same.
 */
export interface State {
  locale: string;
}

export const define = createDefine<State>();
