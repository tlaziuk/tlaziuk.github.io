import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

// tslint:disable-next-line:no-empty-interface
interface IProps { }

const useStyles = makeStyles({
    root: {
        height: "100vh",
        margin: 0,
        width: "100vw",
    },
});

export default function Progress(props: IProps) {
    const {
        root: classesRoot,
    } = useStyles(props);

    return <Grid
        container
        className={classesRoot}
        alignItems="center"
        justify="center"
    >
        <Grid item>
            <CircularProgress
                color="inherit"
                size="25vmin"
            />
        </Grid>
    </Grid>;
}
