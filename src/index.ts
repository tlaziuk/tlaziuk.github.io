import CssBaseline from "@material-ui/core/CssBaseline";
import { createElement } from "react";
import { render } from "react-dom";
import HomeComponent from "./home";
import RootComponent from "./root";

const el = document.getElementById("root")!;

render(
    createElement(RootComponent),
    el,
);
