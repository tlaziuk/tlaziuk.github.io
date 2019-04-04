import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { ComponentProps, HTMLProps, PureComponent } from "react";
import { push } from "redux-first-routing";
import { Unsubscribable } from "rxjs";
import Game, { Game2048 } from "../component/2048";
import store from "../store";
import resizeObserver from "../util/resize-observer";
import url from "../util/url";

interface IState {
    score: number;
    loseDialog: boolean;
    winDialog: boolean;
    containerWidth: number;
    containerHeight: number;
}

export default withStyles(({ spacing }) => ({
    containerClass: {
        height: "100vh",
        width: "100vw",
    },
    gameClass: {
        padding: spacing.unit,
    },
    gameContainerClass: {
        float: "left" as any,
    },
    scoreClass: {
        float: "left" as any,
        padding: spacing.unit,
    },
}))(class Game2048PageComponent extends PureComponent<WithStyles, IState> {
    public readonly state: Readonly<IState> = {
        containerHeight: 0,
        containerWidth: 0,
        loseDialog: false,
        score: 0,
        winDialog: false,
    };

    private game: Game2048 | undefined;

    private containerElement: Element | undefined;

    private containerRectSubscription: Unsubscribable | undefined;

    // tslint:disable-next-line:max-line-length
    private gameRectCache: Record<IState["containerWidth"], Record<IState["containerHeight"], ReturnType<Game2048PageComponent["getGameRectSize"]>>> = {};

    public render() {
        const {
            classes: {
                gameClass,
                gameContainerClass,
                containerClass,
                scoreClass,
            },
        } = this.props;
        const {
            winDialog,
            loseDialog,
            score,
        } = this.state;

        const {
            gameFrame,
            gameHeight,
            gameWidth,
            scoreHeight,
            scoreWidth,
        } = this.getGameRectSize();

        return <>
            <div className={containerClass} ref={this.handleContainerRef}>
                <Grid
                    container
                    justify="center"
                    alignItems={gameWidth > gameHeight ? "center" : "flex-start"}
                    className={gameContainerClass}
                    style={{ width: gameWidth, height: gameHeight }}
                >
                    <Grid item className={gameClass} style={{ width: gameFrame, height: gameFrame }}>
                        <Game
                            onLose={this.handleLose}
                            onWin={this.handleWin}
                            onScore={this.handleScore}
                            innerRef={this.handleRef}
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    justify="center"
                    alignItems="flex-start"
                    className={scoreClass}
                    style={{ width: scoreWidth, height: scoreHeight }}
                >
                    <Grid item>
                        <Typography variant="headline">Score: {score}</Typography>
                    </Grid>
                </Grid>
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

    public componentWillUnmount() {
        const { containerRectSubscription } = this;
        if (containerRectSubscription) {
            containerRectSubscription.unsubscribe();
        }
    }

    public restart() {
        const { game } = this;
        if (game) {
            game.restart();
        } else {
            throw new Error("game instance does not exists");
        }
    }

    private getGameRectSize(): {
        gameFrame: number;
        gameHeight: number;
        gameWidth: number;
        scoreHeight: number;
        scoreWidth: number;
    } {
        const {
            state: {
                containerHeight,
                containerWidth,
            },
            gameRectCache,
        } = this;

        if (gameRectCache[containerWidth]) {
            if (gameRectCache[containerWidth][containerHeight]) {
                return gameRectCache[containerWidth][containerHeight];
            }
        } else {
            gameRectCache[containerWidth] = {};
        }

        let gameFrame: number;
        let scoreWidth: number;
        let scoreHeight: number;
        let gameWidth: number;
        let gameHeight: number;

        let proportions = 1;
        if (containerHeight > containerWidth) {
            proportions = containerWidth / containerHeight;
        } else if (containerHeight < containerWidth) {
            proportions = containerHeight / containerWidth;
        }

        if (proportions > 0.75) {
            gameFrame = Math.floor(Math.min(containerHeight, containerWidth) * (1.75 - proportions));
        } else {
            gameFrame = Math.min(containerHeight, containerWidth);
        }

        if (containerHeight > containerWidth) {
            scoreHeight = containerHeight - gameFrame;
            gameHeight = containerHeight - scoreHeight;
            gameWidth = scoreWidth = containerWidth;
        } else {
            gameHeight = scoreHeight = containerHeight;
            scoreWidth = containerWidth - gameFrame;
            gameWidth = containerWidth - scoreWidth;
        }

        return gameRectCache[containerWidth][containerHeight] = {
            gameFrame,
            gameHeight,
            gameWidth,
            scoreHeight,
            scoreWidth,
        };
    }

    private readonly handleContainerRef: HTMLProps<HTMLDivElement>["ref"] = (element) => {
        if (element && element !== this.containerElement) {
            this.containerElement = element;

            this.containerRectSubscription = resizeObserver(element).subscribe(
                ({ width: containerWidth, height: containerHeight }) => {
                    this.setState({ containerWidth, containerHeight });
                },
            );
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
