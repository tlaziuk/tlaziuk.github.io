import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { PureComponent } from "react";
import { push } from "redux-first-routing";
import store from "../store";

export default class SecretComponent extends PureComponent {
    public render() {
        return <Dialog open={true} onClose={this.handleClose}>
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous location data to
                    Google, even when no apps are running.
          </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                    Close
          </Button>
            </DialogActions>
        </Dialog>;
    }

    private readonly handleClose = async () => {
        const { default: url } = await import("../util/url");
        store.dispatch(push(url("homepage")));
    }
}
