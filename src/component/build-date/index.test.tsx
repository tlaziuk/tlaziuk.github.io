import React from "react";
import { create, ReactTestRenderer } from "react-test-renderer";
import BuildDate from "./index";

describe(BuildDate, () => {
    let element: ReactTestRenderer;

    beforeEach(() => {
        element = create(<BuildDate />);
    });

    it("should create element", () => {
        expect(typeof element.toJSON()).toEqual("string");
    });
});
