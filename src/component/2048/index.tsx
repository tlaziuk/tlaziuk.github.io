// tslint:disable:max-line-length

import { withStyles, WithStyles } from "@material-ui/core/styles";
import React, { CSSProperties, PureComponent } from "react";
import { fromEvent, merge, Unsubscribable } from "rxjs";
import { filter, map, mapTo, share, switchMap, take } from "rxjs/operators";
import Tile from "./tile";

const enum GameState {
    Playing,
    Won,
    Lost,
}

interface ITile {
    x: number;
    y: number;
    value: number;
    uid: number;
    isNew: boolean;
}

interface IVector {
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
}

interface IState {
    data: ReadonlyArray<Readonly<ITile>>;
    gameState: GameState;
}

const buildBoard = (size: number): ITile[] => Array(Math.pow(size, 2)).fill(undefined).map(
    ({ }, index) => ({
        isNew: false,
        uid: index,
        value: 0,
        x: (index % size) + 1,
        y: Math.floor(index / size) + 1,
    }),
);

const getTile = (x: ITile["x"], y: ITile["y"], data: IState["data"]) => data.find((_) => _.x === x && _.y === y);

/**
 * check if given coordinates are on board
 */
const isOnBoard = (x: ITile["x"], y: ITile["y"], size: IProps["size"]) => x >= 1 && x <= size && y >= 1 && y <= size;

const findFarthestTile = (
    tile: Readonly<ITile>,
    vector: Readonly<IVector>,
    data: IState["data"],
    searchingTile = tile,
): Readonly<ITile> => {
    if (vector.x === 0 && vector.y === 0) {
        return tile;
    }

    const x = tile.x + vector.x;
    const y = tile.y + vector.y;

    if (isOnBoard(x, y, Math.sqrt(data.length))) {
        const farthestTile = getTile(x, y, data)!;
        if (farthestTile.value === 0) {
            return findFarthestTile(farthestTile, vector, data, searchingTile);
        } else if (farthestTile.value === searchingTile.value) {
            return farthestTile;
        }
    }

    return tile;
};

interface IProps {
    size: number;
    initialData?: IState["data"];
    onScore?: (_: number, data: IState["data"]) => void;
    onWin?: (_: number, data: IState["data"]) => void;
    onLose?: (_: number, data: IState["data"]) => void;
}

export class Game2048 extends PureComponent<WithStyles & IProps, IState> {
    public static readonly defaultProps: Readonly<Partial<IProps>> = {
        size: 4,
    };

    // tslint:disable-next-line:member-ordering
    public readonly state: Readonly<IState> = {
        data: (() => {
            const { initialData, size } = this.props;
            if (initialData && initialData.length === Math.pow(size, 2)) {
                return initialData;
            } else {
                return buildBoard(size);
            }
        })(),
        gameState: GameState.Playing,
    };

    private document?: Document;

    private subscription?: Unsubscribable;

    public render() {
        const {
            classes: {
                container,
                item,
            },
        } = this.props;
        const {
            data,
        } = this.state;

        return <div className={container} ref={this.handleRef}>{
            (data as ITile[]).sort((a, b) => a.uid - b.uid).map(
                (tile) => <div
                    className={item}
                    key={tile.uid}
                    style={this.getTileStyle(tile)}
                >
                    <Tile value={tile.value} />
                </div>,
            )
        }</div>;
    }

    public componentDidUpdate(
        {
            size: prevSize,
        }: Readonly<IProps>,
        {
            data: prevData,
            gameState: prevGameState,
        }: Readonly<IState>,
    ) {
        const { data, gameState } = this.state;
        const { onScore, onLose, onWin, size } = this.props;

        const score = data.reduce<number>(
            (_, { value }) => _ + value,
            0,
        );

        if (data !== prevData) {
            if (onScore && score !== prevData.reduce<number>(
                (_, { value }) => _ + value,
                0,
            )) {
                onScore(score, data);
            }

            if (data.filter(({ value }) => value === 2048).length > 0) {
                this.setState({ gameState: GameState.Won });
            } else if (data.filter(({ value }) => value === 0).length === 0) {
                this.setState({ gameState: GameState.Lost });
            }

        }

        if (gameState !== prevGameState) {
            if (onLose && gameState === GameState.Lost) {
                onLose(score, data);
            }
            if (onWin && gameState === GameState.Won) {
                onWin(score, data);
            }
        }

        if (size !== prevSize) {
            this.setState({ data: buildBoard(size) });
        }
    }

    public componentWillUnmount() {
        const { subscription } = this;
        if (subscription) {
            subscription.unsubscribe();
        }
    }

    public restart() {
        const { size } = this.props;
        this.setState({
            data: buildBoard(size),
            gameState: GameState.Playing,
        });
    }

    private getTileStyle({ x, y, value, isNew }: Readonly<ITile>): CSSProperties {
        const { size } = this.props;

        const percentage = `${100 / size}%`;

        return {
            height: percentage,
            transform: `translate(${(x - 1) * 100}%, ${(y - 1) * 100}%)`,
            transitionDuration: value === 0 || isNew ? "0s" : undefined,
            width: percentage,
            zIndex: value,
        };
    }

    /**
     * add a new tile to the board
     */
    private newTile() {
        const { data } = this.state;
        const zeroValueTiles = data.filter(({ value }) => value === 0);
        const tileUid = zeroValueTiles.length && zeroValueTiles[Math.floor(Math.random() * zeroValueTiles.length)].uid;

        this.setState({
            data: data.map(
                (tile) => ({
                    ...tile,
                    isNew: tile.uid === tileUid,
                    value: tile.uid === tileUid ? 1 : tile.value,
                }),
            ),
        });
    }

    private readonly handleRef = (element: HTMLElement | null) => {
        if (element) {
            const document = element.ownerDocument;
            if (document && document !== this.document) {
                this.document = document;
                const { subscription } = this;

                if (subscription) {
                    subscription.unsubscribe();
                }

                const key$ = fromEvent<KeyboardEvent>(document, "keyup").pipe(
                    map(({ key }) => key),
                    share(),
                );

                const touch$ = fromEvent<TouchEvent>(document, "touchstart").pipe(
                    filter(
                        // allow only one-finger touch
                        ({ touches }) => touches.length === 1,
                    ),
                    map(
                        ({ touches }) => touches[0],
                    ),
                    switchMap(
                        // assign the touch endevent
                        (touchStart) => fromEvent<TouchEvent>(document, "touchend").pipe(
                            map(
                                // identify the leaving finger
                                ({ changedTouches }) => Array.from(changedTouches).find(
                                    ({ identifier }) => identifier === touchStart.identifier,
                                ),
                            ),
                            filter(
                                // `find` method may fail, filter out the result
                                (_): _ is Touch => _ as any,
                            ),
                            take(1),
                            map(
                                // extract coordinates from events
                                (touchEnd) => {
                                    const { clientX: aX, clientY: aY } = touchStart;
                                    const { clientX: bX, clientY: bY } = touchEnd;
                                    return { aX, aY, bX, bY };
                                },
                            ),
                        ),
                    ),
                    filter(
                        // filter out clicks/taps
                        ({ aX, aY, bX, bY }) => aX !== bX || aY !== bY,
                    ),
                    map(
                        /**
                         * angle between two points in degrees
                         *
                         * imagine that as the 0 is on the right of virtual circle,
                         * degrees up to -180 are on the left of 0,
                         * degrees up to 180 are on the right of 0
                         */
                        ({ aX, aY, bX, bY }) => Math.atan2(bY - aY, bX - aX) * 180 / Math.PI,
                    ),
                    share(),
                );

                this.subscription = merge(
                    key$.pipe(
                        filter((_) => _ === "ArrowUp"),
                        mapTo("up" as "up"),
                    ),
                    key$.pipe(
                        filter((_) => _ === "ArrowDown"),
                        mapTo("down" as "down"),
                    ),
                    key$.pipe(
                        filter((_) => _ === "ArrowRight"),
                        mapTo("right" as "right"),
                    ),
                    key$.pipe(
                        filter((_) => _ === "ArrowLeft"),
                        mapTo("left" as "left"),
                    ),
                    touch$.pipe(
                        map(
                            (degree) => {
                                if (degree > -45 && degree < 45) {
                                    return "right" as "right";
                                } else if (degree > -135 && degree < -45) {
                                    return "up" as "up";
                                } else if (degree > 45 && degree < 135) {
                                    return "down" as "down";
                                } else if ((degree > -180 && degree < -135) || (degree > 135 && degree < 180)) {
                                    return "left" as "left";
                                } else {
                                    return undefined as never;
                                }
                            },
                        ),
                    ),
                ).pipe(
                    filter(() => this.state.gameState === GameState.Playing),
                ).subscribe((direction) => {
                    let { data } = this.state;
                    let vector: IVector;
                    switch (direction) {
                        case "right": {
                            vector = { x: 1, y: 0 };
                            break;
                        }
                        case "left": {
                            vector = { x: -1, y: 0 };
                            break;
                        }
                        case "up": {
                            vector = { x: 0, y: -1 };
                            break;
                        }
                        case "down": {
                            vector = { x: 0, y: 1 };
                            break;
                        }
                        default: {
                            return;
                        }
                    }

                    for (const tile of data.slice().sort(
                        (a, b) => {
                            if (vector.x === -1) {
                                return a.x - b.x;
                            }
                            if (vector.x === 1) {
                                return b.x - a.x;
                            }
                            if (vector.y === -1) {
                                return a.y - b.y;
                            }
                            if (vector.y === 1) {
                                return b.y - a.y;
                            }
                            return 0;
                        },
                    )) {
                        if (tile.value === 0) {
                            continue;
                        }

                        const farthestTile = findFarthestTile(tile, vector!, data);

                        if (tile.uid === farthestTile.uid) {
                            continue;
                        }

                        data = data.map(
                            (_) => {
                                if (_.uid === tile.uid) {
                                    return {
                                        ..._,
                                        uid: farthestTile.uid,
                                        value: 0,
                                    };
                                } else if (_.uid === farthestTile.uid) {
                                    return {
                                        ..._,
                                        uid: tile.uid,
                                        value: tile.value + farthestTile.value,
                                    };
                                }

                                return _;
                            },
                        );
                    }

                    this.setState({ data });
                    this.newTile();
                });
            }
        }
    }
}

export default withStyles(({ spacing }) => ({
    container: {
        display: "block",
        height: "100%",
        position: "relative",
        width: "100%",
    },
    item: {
        display: "inline-block",
        left: 0,
        padding: spacing(),
        position: "absolute",
        top: 0,
        transformOrigin: "center",
        transitionDuration: "0.25s",
        transitionProperty: "all",
        transitionTimingFunction: "ease-in-out",
    },
}))(Game2048);
