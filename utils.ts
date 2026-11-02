import { createDefine } from "fresh";

/**
 * Shape of `ctx.state`, shared between middlewares and routes. Nothing is put
 * on it yet, but keeping the central definition makes adding state explicit.
 */
export type State = Record<string, never>;

export const define = createDefine<State>();
