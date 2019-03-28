import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import React, { ComponentType, lazy, LazyExoticComponent, PureComponent, Suspense } from "react";
import { Unsubscribable } from "rxjs";
import Progress from "./progress";
import { resolvedRoute$ } from "./router";
import theme from "./theme";

interface IState {
    node: LazyExoticComponent<ComponentType<any>>;
}

export default class RootContainer extends PureComponent<any, IState> {
    public readonly state: Readonly<IState> = {
        node: lazy(() => new Promise<any>(() => {
            // pass
        })),
    };

    private nodeSubscription?: Unsubscribable;

    public componentDidMount() {
        this.nodeSubscription = resolvedRoute$.subscribe(
            (_) => {
                this.setState({
                    node: lazy(() => _.then((component) => ({ default: component }))),
                });
            },
        );
    }

    public componentWillUnmount() {
        const { nodeSubscription } = this;
        if (nodeSubscription) {
            nodeSubscription.unsubscribe();
        }
    }

    public render() {
        const { node: Node } = this.state;
        return <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Suspense fallback={<Progress />}>
                <Node />
            </Suspense>
        </MuiThemeProvider>;
    }
}
