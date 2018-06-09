import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import { render } from "react-dom";
import HomeComponent from "./home";

const el = document.getElementById("root")!;

render(
    <>
        <CssBaseline />
        <HomeComponent />
    </>,
    el,
);
