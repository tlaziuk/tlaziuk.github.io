import { StyledComponentProps, withStyles } from "@material-ui/core/styles";
import EmailIcon from "@material-ui/icons/Email";
import React, { PureComponent } from "react";

export default withStyles(
    ({ palette }) => ({
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
        href: {
            color: palette.text.primary,
            display: "block",
            height: "100%",
            width: "100%",
        },
        svg: {
            display: "block",
            height: "100%",
            width: "100%",
        },
    }),
)(class HomeComponent extends PureComponent<StyledComponentProps<"href" | "svg">> {
    public render() {
        const {
            classes,
        } = this.props;
        return <a href="mailto:tlaziuk+github@gmail.com" className={classes!.href}>
            <EmailIcon
                className={classes!.svg}
                color={"inherit"}
            />
        </a>;
    }
});
