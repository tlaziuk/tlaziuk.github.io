import { useTheme } from "@material-ui/core/styles";
import { createElement, useEffect, useRef } from "react";

export default function ThemeColor() {
    const ref = useRef<HTMLDivElement>(null);
    const {
        palette: {
            background: {
                default: backgroundColor,
            },
        },
    } = useTheme();

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
}
