import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EmailIcon from "@material-ui/icons/Email";
import React, { ComponentProps, PureComponent } from "react";
import { push } from "redux-first-routing";
import BuildDate from "../component/build-date";
import GitRevision from "../component/git-revision";
import Konami from "../component/konami";
import store from "../store";
import url from "../util/url";

export default withStyles(
    ({ spacing }) => ({
        leftIcon: {
            marginRight: spacing(1),
        },
        revision: {
            alignSelf: "flex-end",
            justifySelf: "flex-end",
        },
        root: {
            height: "100vh",
            margin: 0,
            width: "100vw",
        },
    }),
)(class HomeComponent extends PureComponent<WithStyles> {
    public render() {
        const {
            classes: {
                root: classesRoot,
                revision: classesRevision,
                leftIcon: classesLeftIcon,
            },
        } = this.props;
        return <>
            <Konami action={this.konami} />
            <Grid
                container
                className={classesRoot}
                direction="column"
                justify="space-between"
                alignItems="center"
                spacing={2}
            >
                <Grid item />
                <Grid item>
                    <Button
                        component="a"
                        variant="text"
                        size="large"
                        href={`mailto:${process.env.APP_EMAIL}`}
                    >
                        <EmailIcon className={classesLeftIcon} />
                        email me
                    </Button>
                </Grid>
                <Grid item className={classesRevision}>
                    <Typography variant="caption">
                        <GitRevision length={7} /> <BuildDate />
                    </Typography>
                </Grid>
            </Grid>
        </>;
    }

    private readonly konami: ComponentProps<typeof Konami>["action"] = () => {
        store.dispatch(push(url("konami")));
    }
});
