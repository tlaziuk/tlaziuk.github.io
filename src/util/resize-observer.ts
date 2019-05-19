import { Observable } from "rxjs";

export default (target: Element) => new Observable<DOMRectReadOnly>(
    (subscriber) => {
        const unsub = (async () => {
            try {
                const Observer: typeof import("resize-observer-polyfill")["default"] = (
                    (window as any).ResizeObserver ?
                        (window as any).ResizeObserver : (await import("resize-observer-polyfill")).default

                );

                const instance = new Observer((entries) => {
                    for (const { contentRect } of entries) {
                        subscriber.next(contentRect as any);
                    }
                });

                instance.observe(target);

                return () => {
                    instance.unobserve(target);
                    instance.disconnect();
                    subscriber.complete();
                };
            } catch (e) {
                subscriber.error(e);

                return () => {
                    subscriber.complete();
                };
            }
        })();

        return async () => {
            (await unsub)();
        };
    },
);
