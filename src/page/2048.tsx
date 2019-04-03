import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import React, { ComponentProps, PureComponent } from "react";
import Game from "../component/2048";

interface IState {
    score: number;
    loseDialog: boolean;
    winDialog: boolean;
}

export default withStyles(() => ({
    game: {
        height: "100vmin",
        width: "100vmin",
    },
}))(class Game2048PageComponent extends PureComponent<WithStyles, IState> {
    public readonly state: Readonly<IState> = {
        loseDialog: false,
        score: 0,
        winDialog: false,
    };

    public render() {
        const {
            classes: {
                game,
            },
        } = this.props;
        const { winDialog, loseDialog, score } = this.state;

        return <>
            <div className={game}>
                <Game
                    onLose={this.handleLose}
                    onWin={this.handleWin}
                    onScore={this.handleScore}
                />
            </div>
            <Dialog open={loseDialog} onClose={this.handleLoseDialogClose}>
                <DialogTitle>You've lost!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your score was {score}, do you want to try again?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleLoseDialogClose}>No</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={winDialog} onClose={this.handleWinDialogClose}>
                <DialogTitle>You've won!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your score was {score}, do you want to try again?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleWinDialogClose}>No</Button>
                </DialogActions>
            </Dialog>
        </>;
    }

    private readonly handleScore: ComponentProps<typeof Game>["onScore"] = (score) => {
        this.setState({ score });
    }

    private readonly handleWin: ComponentProps<typeof Game>["onWin"] = (score) => {
        this.setState({ score, winDialog: true });
    }

    private readonly handleLose: ComponentProps<typeof Game>["onLose"] = (score) => {
        this.setState({ score, loseDialog: true });
    }

    private readonly handleLoseDialogClose = () => {
        this.setState({ loseDialog: false });
    }

    private readonly handleWinDialogClose = () => {
        this.setState({ winDialog: false });
    }
});
