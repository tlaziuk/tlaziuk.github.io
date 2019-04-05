import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { PureComponent } from "react";
import { push } from "redux-first-routing";
import store from "../store";
import url from "../util/url";

export default class SecretComponent extends PureComponent {
    public render() {
        return <Dialog open={true} onClose={this.handleClose}>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You've found the secret content of this website, although there is no secret content. 🙂
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose}>Close</Button>
            </DialogActions>
        </Dialog>;
    }

    private readonly handleClose = () => {
        store.dispatch(push(url("homepage")));
    }
}
