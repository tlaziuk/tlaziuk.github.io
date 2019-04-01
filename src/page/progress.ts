import CircularProgress from "@material-ui/core/CircularProgress";
import { StyledComponentProps, withStyles } from "@material-ui/core/styles";
import { createElement, FunctionComponent, memo } from "react";

export default memo(
    withStyles(({ palette }) => ({
        ["@global"]: {
            body: {
                height: "25vmax",
                left: "50%",
                maxHeight: "100vh",
                maxWidth: "100vw",
                position: "absolute",
                top: "50%",
                transform: "translate(-50%,-50%)",
                width: "25vmax",

            },
        },
        root: {
            color: palette.text.primary,
            display: "block",
        },
    }))((({
        classes: { root: className } = {},
    }) => createElement(
        CircularProgress,
        {
            className,
            size: "100%",
        },
    )) as FunctionComponent<StyledComponentProps<"root">>),
    () => true,
);
