import { createElement } from "react";
import { render } from "react-dom";
import RootComponent from "./root";

const el = document.getElementById("root")!;

render(
    createElement(RootComponent),
    el,
);
