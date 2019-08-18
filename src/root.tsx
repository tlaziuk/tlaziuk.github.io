import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import React, { ComponentType, lazy, LazyExoticComponent, Suspense, useEffect, useState } from "react";
import ThemeColor from "./component/theme-color";
import Progress from "./page/progress";
import { resolvedRoute$ } from "./router";
import theme from "./theme";

const defaultNode = lazy(() => new Promise<any>(() => {
    // promise never resolves
}));

export default function RootContainer() {
    const [Node, setNode] = useState<LazyExoticComponent<ComponentType<any>>>(defaultNode);

    useEffect(
        () => {
            const subscription = resolvedRoute$.subscribe(
                (_) => {
                    setNode(
                        lazy(() => _.then((component) => ({ default: component }))),
                    );
                },
            );
            return () => {
                subscription.unsubscribe();
            };
        },
        [],
    );

    return <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeColor />
        <Suspense fallback={<Progress />}>
            <Node />
        </Suspense>
    </MuiThemeProvider>;
}
