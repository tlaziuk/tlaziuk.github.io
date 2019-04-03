// tslint:disable:max-line-length

import { withStyles, WithStyles } from "@material-ui/core/styles";
import React, { CSSProperties, PureComponent } from "react";
import { fromEvent, merge, Unsubscribable } from "rxjs";
import { filter, map, mapTo, share } from "rxjs/operators";
import Tile from "./tile";

interface ITile {
    x: number;
    y: number;
    value: number;
    uid: number;
}

interface IVector {
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
}

interface IState {
    data: ReadonlyArray<Readonly<ITile>>;
}

interface IProps {
    size: number;
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
        padding: spacing.unit,
        position: "absolute",
        top: 0,
        transformOrigin: "center",
        transitionDuration: "0.25s",
        transitionProperty: "all",
        transitionTimingFunction: "ease-in-out",
    },
}))(class Game2048 extends PureComponent<WithStyles & IProps, IState> {
    public static readonly defaultProps: Readonly<Partial<IProps>> = {
        size: 4,
    };

    private uid: number = 0;

    // tslint:disable-next-line:member-ordering
    public readonly state: Readonly<IState> = {
        data: Array(Math.pow(this.props.size, 2)).fill(undefined).map(
            ({ }, index) => ({
                uid: this.uid++,
                value: 0,
                x: (index % this.props.size) + 1,
                y: Math.floor(index / this.props.size) + 1,
            }),
        ),
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
            data.map(
                ({ x, y, value, uid }) => <div
                    className={item}
                    key={uid}
                    style={this.getTileStyle(x, y)}
                >
                    <Tile value={value} />
                </div>,
            )
        }</div>;
    }

    public componentDidMount() {
        this.newTile();
    }

    public componentWillUnmount() {
        const { subscription } = this;
        if (subscription) {
            subscription.unsubscribe();
        }
    }

    private getTileStyle(row: number, column: number): CSSProperties {
        const { size } = this.props;

        const percentage = `${100 / size}%`;

        return {
            height: percentage,
            transform: `translate(${(row - 1) * 100}%, ${(column - 1) * 100}%)`,
            width: percentage,
        };
    }

    private newTile() {
        const { data } = this.state;
        const zeroValueTiles = data.filter(({ value }) => value === 0);
        const tileUid = zeroValueTiles.length && zeroValueTiles[Math.floor(Math.random() * zeroValueTiles.length)].uid;

        this.setState({
            data: data.map(
                (tile) => ({
                    ...tile,
                    value: tile.uid === tileUid ? 1 : tile.value,
                }),
            ),
        });
    }

    /**
     * check if given coordinates are on board
     */
    private isOnBoard(x: ITile["x"], y: ITile["y"]) {
        const { size } = this.props;
        return x >= 1 && x <= size && y >= 1 && y <= size;
    }

    private getTile(x: ITile["x"], y: ITile["y"], data: IState["data"]) {
        return data.find((_) => _.x === x && _.y === y);
    }

    private findFarthestTile(
        tile: Readonly<ITile>,
        vector: Readonly<IVector>,
        data: IState["data"],
        searchingTile = tile,
    ): Readonly<ITile> {
        if (vector.x === 0 && vector.y === 0) {
            return tile;
        }

        const x = tile.x + vector.x;
        const y = tile.y + vector.y;

        if (this.isOnBoard(x, y)) {
            const farthestTile = this.getTile(x, y, data)!;
            if (farthestTile.value === 0) {
                return this.findFarthestTile(farthestTile, vector, data, searchingTile);
            } else if (farthestTile.value === searchingTile.value) {
                return farthestTile;
            }
        }

        return tile;
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
                ).subscribe((direction) => {
                    let { data } = this.state;
                    const { size } = this.props;
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
                            vector = { x: 0, y: 0 };
                            break;
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

                        const farthestTile = this.findFarthestTile(tile, vector!, data);

                        if (tile.uid === farthestTile.uid) {
                            continue;
                        }

                        data = data.map(
                            (_) => {
                                if (_.uid === tile.uid) {
                                    return {
                                        ..._,
                                        uid: this.uid++,
                                        value: 0,
                                    };
                                } else if (_.uid === farthestTile.uid) {
                                    return {
                                        ..._,
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
});