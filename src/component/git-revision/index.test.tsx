import React from "react";
import { create, ReactTestRenderer } from "react-test-renderer";
import Revision from "./index";

describe(Revision, () => {
    let element: ReactTestRenderer;

    beforeEach(() => {
        element = create(<Revision />);
    });

    it("should create element", () => {
        expect(typeof element.toJSON()).toEqual("string");
    });
});
