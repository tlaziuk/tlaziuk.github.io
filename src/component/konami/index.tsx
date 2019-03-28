import { Component, createElement } from "react";
import { fromEvent, Unsubscribable } from "rxjs";
import { filter, map, scan } from "rxjs/operators";

interface IProps {
    code: ReadonlyArray<string>;
    action: () => any;
}

export default class Konami extends Component<IProps> {
    public static readonly defaultProps: Partial<Readonly<IProps>> = {
        code: [
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
        ],
    };

    private document?: Document;

    private subscription?: Unsubscribable;

    public shouldComponentUpdate() {
        return false;
    }

    public componentWillUnmount() {
        const { subscription } = this;
        if (subscription) {
            subscription.unsubscribe();
        }
    }

    public render() {
        return createElement(
            "div",
            {
                ref: this.handleRef,
                style: { display: "none" },
            },
        );
    }

    private readonly handleRef = (element: HTMLElement | null) => {
        if (element) {
            const document = element.ownerDocument;
            if (document && document !== this.document) {
                this.document = document;
                const { subscription } = this;
                if (subscription) {
                    subscription.unsubscribe();
                }
                this.subscription = fromEvent<KeyboardEvent>(document, "keyup").pipe(
                    map(({ key }) => key),
                    scan<string, ReadonlyArray<string>>(
                        (accumulator, value) => {
                            const { code } = this.props;
                            return [
                                ...accumulator.slice(
                                    accumulator.length < code.length ? 0 : 1,
                                    code.length + 1,
                                ),
                                value,
                            ];
                        },
                        [],
                    ),
                    filter(
                        (value) => {
                            const { code } = this.props;
                            for (let i = 0; i < code.length; i++) {
                                if (value[i] !== code[i]) {
                                    return false;
                                }
                            }
                            return true;
                        },
                    ),
                ).subscribe(async () => {
                    try {
                        await this.props.action();
                    } catch {
                        // pass
                    }
                });
            }
        }
    }
}
