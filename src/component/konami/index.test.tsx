import React from "react";
import { act, create, ReactTestRenderer } from "react-test-renderer";
import { DeepPartial } from "redux";
import Konami from "./index";

describe(Konami, () => {
    let element: ReactTestRenderer;
    let addEventListener: jest.Mock<void, [keyof DocumentEventMap, any]>;
    let removeEventListener: jest.Mock<void, [keyof DocumentEventMap, any]>;
    let listenerMap: Record<keyof DocumentEventMap, (..._: any[]) => any>;
    const defaultAction = () => {
        // pass
    };
    const defaultCode = [
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

    beforeEach(() => {
        listenerMap = {} as any;

        addEventListener = jest.fn<void, [keyof DocumentEventMap, any]>(
            (name, listener) => {
                listenerMap[name] = listener;
            },
        );

        removeEventListener = jest.fn<void, [keyof DocumentEventMap, any]>(
            (name) => {
                delete listenerMap[name];
            },
        );

        element = create(
            <Konami action={defaultAction} code={defaultCode} />,
            {
                createNodeMock: (): DeepPartial<HTMLElement> => ({
                    ownerDocument: {
                        addEventListener,
                        removeEventListener,
                    },
                } as any),
            },
        );
    });

    it("should create element", () => {
        expect(element.root!.find(({ type }) => typeof type === "string")).toBeTruthy();
    });

    it("should attach a listener", () => {
        expect(listenerMap.keyup).toBeDefined();
    });

    it("should remove listener after unmount", () => {
        element.unmount();
        expect(listenerMap.keyup).toBeUndefined();
    });

    it("should call execute the action after default sequence", () => {
        const action = jest.fn();
        element.update(<Konami action={action} code={defaultCode} />);
        act(() => {
            for (const key of defaultCode) {
                listenerMap.keyup({ key });
            }
        });
        expect(action).toBeCalled();
    });
});
