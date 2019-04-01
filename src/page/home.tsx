import { StyledComponentProps, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EmailIcon from "@material-ui/icons/Email";
import React, { PureComponent } from "react";
import { push } from "redux-first-routing";
import BuildDate from "../component/build-date";
import GitRevision from "../component/git-revision";
import Konami from "../component/konami";
import store from "../store";

export default withStyles(
    ({ palette, spacing }) => ({
        container: {
            height: "25vmax",
            left: "50%",
            maxHeight: "100vh",
            maxWidth: "100vw",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: "25vmax",

        },
        href: {
            color: palette.text.primary,
            display: "block",
            height: "100%",
            width: "100%",
        },
        revision: {
            bottom: 0,
            padding: spacing.unit,
            position: "fixed",
            right: 0,
        },
        svg: {
            display: "block",
            height: "100%",
            width: "100%",
        },
    }),
)(class HomeComponent extends PureComponent<StyledComponentProps<"href" | "svg" | "revision" | "container">> {
    public render() {
        const {
            classes,
        } = this.props;
        return <>
            <Konami action={this.konami} />
            <div className={classes!.container}>
                <a href="mailto:tlaziuk+github@gmail.com" className={classes!.href}>
                    <EmailIcon
                        className={classes!.svg}
                        color={"inherit"}
                    />
                </a>
            </div>
            <Typography variant="caption" className={classes!.revision}>
                rev. <GitRevision length={7} /> <BuildDate />
            </Typography>
        </>;
    }

    private readonly konami = async () => {
        const { default: url } = await import("../util/url");
        store.dispatch(push(url("konami")));
    }
});
