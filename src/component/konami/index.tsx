import { createElement, useEffect, useRef, useState } from "react";

interface IProps {
    code?: ReadonlyArray<string>;
    action: () => any;
}

const defaultCode: Required<IProps>["code"] = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

const defaultKeys = [] as ReadonlyArray<string>;

export default function Konami({
    code = defaultCode,
    action,
}: IProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [keys, setKeys] = useState(defaultKeys);

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

            const listener = ({ key }: KeyboardEvent) => {
                setKeys((stateKeys) => [key, ...stateKeys]);
            };

            document.addEventListener("keyup", listener);

            return () => {
                document.removeEventListener("keyup", listener);
            };
        },
        [ref.current && ref.current.ownerDocument],
    );

    useEffect(
        () => {
            const keysTmp = keys.slice(0, code.length).reverse();

            for (let index = 0; index < code.length; index++) {
                if (code[index] !== keysTmp[index]) {
                    return;
                }
            }
            action();
        },
        [keys, code, action],
    );

    return createElement(
        "div",
        {
            ref,
            style: { display: "none" },
        },
    );
}
