import { withTheme, WithTheme } from "@material-ui/core/styles";
import { createElement, FunctionComponent, useEffect, useRef } from "react";

export default withTheme(
    (function ThemeColor({
        theme: {
            palette: {
                background: {
                    default: backgroundColor,
                },
            },
        },
    }) {
        const ref = useRef<HTMLDivElement | void>();

        useEffect(
            () => {
                const { current: element } = ref;
                if (!element) {
                    return;
                }
                const { ownerDocument: document } = element;
                if (!document) {
                    return;
                }
                const { head } = document;

                let metaTag = head.querySelector<HTMLMetaElement>(`meta[name="theme-color"]`);

                if (!metaTag) {
                    metaTag = document.createElement("meta");
                    metaTag.name = "theme-color";
                    head.appendChild(metaTag);
                }

                metaTag.content = backgroundColor;

                return () => {
                    head.removeChild(metaTag!);
                };
            },
            [
                ref.current,
                backgroundColor,
            ],
        );

        return createElement(
            "div",
            {
                ref,
                style: { display: "none" },
            },
        );
    }) as FunctionComponent<WithTheme>,
);
