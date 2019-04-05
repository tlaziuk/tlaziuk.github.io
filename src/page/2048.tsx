import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import ReplayIcon from "@material-ui/icons/Replay";
import fscreen from "fscreen";
import React, { ComponentProps, HTMLProps, PureComponent } from "react";
import { push } from "redux-first-routing";
import { fromEvent, Unsubscribable } from "rxjs";
import { map } from "rxjs/operators";
import Game, { Game2048 } from "../component/2048";
import store from "../store";
import resizeObserver from "../util/resize-observer";
import url from "../util/url";

interface IState {
    score: number;
    loseDialog: boolean;
    winDialog: boolean;
    restartDialog: boolean;
    containerWidth: number;
    containerHeight: number;
    fullScreen: boolean;
    snackbarFullScreen: boolean;
}

const initialData = (() => {
    try {
        return JSON.parse(localStorage.getItem("2048")!);
    } catch {
        // pass
    }
})();

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
        fullScreen: false,
        loseDialog: false,
        restartDialog: false,
        score: 0,
        snackbarFullScreen: (() => {
            try {
                return matchMedia("(pointer:coarse)").matches;
            } catch {
                return true;
            }
        })(),
        winDialog: false,
    };

    private game: Game2048 | undefined;

    private containerElement: Element | undefined;

    private containerRectSubscription: Unsubscribable | undefined;

    private fullScreenSubscription: Unsubscribable | undefined;

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
            fullScreen,
            snackbarFullScreen,
            restartDialog,
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
                            initialData={initialData}
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    justify="space-between"
                    alignItems="flex-start"
                    alignContent="flex-start"
                    className={scoreClass}
                    style={{ width: scoreWidth, height: scoreHeight }}
                >
                    <Grid item>
                        <Typography variant="h3">2048</Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Restart">
                            <IconButton onClick={this.handleRestartDialogOpen}>
                                <ReplayIcon />
                            </IconButton>
                        </Tooltip>
                        {
                            fullScreen ?
                                <Tooltip title="Exit fullscreen">
                                    <IconButton onClick={this.exitFullscreen}>
                                        <FullscreenExitIcon />
                                    </IconButton>
                                </Tooltip>
                                :
                                <Tooltip title="Enter fullscreen">
                                    <IconButton onClick={this.enterFullscreen}>
                                        <FullscreenIcon />
                                    </IconButton>
                                </Tooltip>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4">Score: {score}</Typography>
                    </Grid>
                </Grid>
            </div>
            <Dialog open={loseDialog} onClose={this.handleLoseDialogTryAgain} disableBackdropClick={true}>
                <DialogTitle>You've lost!</DialogTitle>
                <DialogContent>
                    <DialogContentText>Your score was {score}.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleLoseDialogTryAgain}>Try again!</Button>
                    <Button onClick={this.handleLoseDialogExit}>Exit!</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={winDialog} onClose={this.handleWinDialogTryAgain} disableBackdropClick={true}>
                <DialogTitle>You've won!</DialogTitle>
                <DialogContent>
                    <DialogContentText>Your score was {score}.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleWinDialogTryAgain}>Try again!</Button>
                    <Button onClick={this.handleWinDialogExit}>Exit!</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={restartDialog} onClose={this.handleRestartDialogNo}>
                <DialogContent>
                    <DialogContentText>Do you really want to restart the game?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleRestartDialogYes}>Yes</Button>
                    <Button onClick={this.handleRestartDialogNo}>No</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                anchorOrigin={{
                    horizontal: "left",
                    vertical: "bottom",
                }}
                open={snackbarFullScreen && !fullScreen}
                onClose={this.handleSnackbarFullscreenClose}
                ContentProps={{
                    "aria-describedby": "snackbar-fullscreen-message",
                }}
                message={
                    <span id="snackbar-fullscreen-message">You can enter fullscreen for better experience 🙂</span>
                }
                action={[
                    <Tooltip
                        title="Enter fullscreen"
                        key="fullscreen"
                    >
                        <IconButton
                            color="secondary"
                            onClick={this.handleSnackbarFullscreen}>
                            <DoneIcon />
                        </IconButton>
                    </Tooltip>,
                    <Tooltip
                        title="Close"
                        key="close"
                    >
                        <IconButton
                            color="primary"
                            onClick={this.handleSnackbarFullscreenClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>,
                ]}
            />
        </>;
    }

    public componentDidMount() {
        this.fullScreenSubscription = fromEvent(fscreen, "fullscreenchange").pipe(
            map(() => Boolean(fscreen.fullscreenElement)),
        ).subscribe((fullScreen) => { this.setState({ fullScreen }); });
    }

    public componentWillUnmount() {
        const {
            containerRectSubscription,
            fullScreenSubscription,
        } = this;
        if (containerRectSubscription) {
            containerRectSubscription.unsubscribe();
        }
        if (fullScreenSubscription) {
            fullScreenSubscription.unsubscribe();
        }
    }

    private restart() {
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

    private readonly handleScore: ComponentProps<typeof Game>["onScore"] = (score, data) => {
        try {
            // store game state
            localStorage.setItem("2048", JSON.stringify(data));
        } catch {
            // pass
        }
        this.setState({ score });
    }

    private readonly handleWin: ComponentProps<typeof Game>["onWin"] = (score) => {
        try {
            // reset memory
            localStorage.setItem("2048", JSON.stringify([]));
        } catch {
            // pass
        }
        this.setState({ score, winDialog: true });
    }

    private readonly handleLose: ComponentProps<typeof Game>["onLose"] = (score) => {
        try {
            // reset memory
            localStorage.setItem("2048", JSON.stringify([]));
        } catch {
            // pass
        }
        this.setState({ score, loseDialog: true });
    }

    private readonly handleLoseDialogTryAgain = () => {
        this.setState({ loseDialog: false });
        this.restart();
    }

    private readonly handleLoseDialogExit = () => {
        this.setState({ winDialog: false });
        store.dispatch(push(url("homepage")));
        this.exitFullscreen();
    }

    private readonly handleWinDialogTryAgain = () => {
        this.setState({ winDialog: false });
        this.restart();
    }

    private readonly handleWinDialogExit = () => {
        this.setState({ winDialog: false });
        store.dispatch(push(url("homepage")));
        this.exitFullscreen();
    }

    private readonly enterFullscreen = () => {
        fscreen.requestFullscreen(this.containerElement!.ownerDocument!.body);
    }

    private readonly exitFullscreen = () => {
        fscreen.exitFullscreen();
    }

    private readonly handleSnackbarFullscreen = () => {
        this.enterFullscreen();
        this.handleSnackbarFullscreenClose();
    }

    private readonly handleSnackbarFullscreenClose = () => {
        this.setState({ snackbarFullScreen: false });
    }

    private readonly handleRestartDialogOpen = () => {
        this.setState({ restartDialog: true });
    }

    private readonly handleRestartDialogNo = () => {
        this.setState({ restartDialog: false });
    }

    private readonly handleRestartDialogYes = () => {
        this.restart();
        this.setState({ restartDialog: false });
    }
});
