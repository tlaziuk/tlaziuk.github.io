import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import React, { ComponentProps, PureComponent } from "react";
import { push } from "redux-first-routing";
import Game, { Game2048 } from "../component/2048";
import store from "../store";
import url from "../util/url";

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

    private game: Game2048 | undefined;

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
                    innerRef={this.handleRef}
                />
            </div>
            <Dialog open={loseDialog} onClose={this.handleLoseDialogTryAgain} disableBackdropClick={true}>
                <DialogTitle>You've lost!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your score was {score}.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleLoseDialogTryAgain}>Try again!</Button>
                    <Button onClick={this.handleLoseDialogClose}>Exit!</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={winDialog} onClose={this.handleWinDialogTryAgain} disableBackdropClick={true}>
                <DialogTitle>You've won!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your score was {score}.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleWinDialogTryAgain}>Try again!</Button>
                    <Button onClick={this.handleWinDialogClose}>Exit!</Button>
                </DialogActions>
            </Dialog>
        </>;
    }

    public restart() {
        const { game } = this;
        if (game) {
            game.restart();
        } else {
            throw new Error("game instance does not exists");
        }
    }

    private readonly handleRef: ComponentProps<typeof Game>["innerRef"] = (instance) => {
        this.game = instance;
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

    private readonly handleLoseDialogTryAgain = () => {
        this.setState({ loseDialog: false });
        this.restart();
    }

    private readonly handleLoseDialogClose = () => {
        this.setState({ winDialog: false });
        store.dispatch(push(url("homepage")));
    }

    private readonly handleWinDialogTryAgain = () => {
        this.setState({ winDialog: false });
        this.restart();
    }

    private readonly handleWinDialogClose = () => {
        this.setState({ winDialog: false });
        store.dispatch(push(url("homepage")));
    }
});
