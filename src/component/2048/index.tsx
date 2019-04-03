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
                    switch (direction) {
                        case "right": {
                            for (let x = size; x >= 1; x--) {
                                for (let y = 1; y <= size; y++) {
                                    const tile = data.find(
                                        (_) => _.x === x && _.y === y,
                                    )!;
                                    if (tile.value === 0) {
                                        continue;
                                    }
                                    let i = x + 1;
                                    let rightTile: Readonly<ITile> | undefined;
                                    while ((!rightTile) && (i <= size)) {
                                        rightTile = data.find(
                                            (_) => _.x === i && _.y === y && _.value === tile.value,
                                        );
                                        i++;
                                    }
                                    if (!rightTile) {
                                        i = size;
                                        while ((!rightTile) && (i > tile.x)) {
                                            rightTile = data.find(
                                                (_) => _.x === i && _.y === y && _.value === 0,
                                            );
                                            i--;
                                        }
                                    }
                                    if (rightTile && !(tile.value === 0 && rightTile.value === 0)) {
                                        data = data.map(
                                            (_) => {
                                                if (_.uid === rightTile!.uid) {
                                                    return {
                                                        ..._,
                                                        value: rightTile!.value + tile.value,
                                                    };
                                                } else if (_.uid === tile.uid) {
                                                    return {
                                                        ..._,
                                                        uid: this.uid++,
                                                        value: 0,
                                                    };
                                                } else {
                                                    return _;
                                                }
                                            },
                                        );
                                    }
                                }
                            }
                            break;
                        }
                        case "left": {
                            for (let x = 1; x <= size; x++) {
                                for (let y = 1; y <= size; y++) {
                                    const tile = data.find(
                                        (_) => _.x === x && _.y === y,
                                    )!;
                                    if (tile.value === 0) {
                                        continue;
                                    }
                                    let i = x - 1;
                                    let leftTile: Readonly<ITile> | undefined;
                                    while ((!leftTile) && (i >= 1)) {
                                        leftTile = data.find(
                                            (_) => _.x === i && _.y === y && _.value === tile.value,
                                        );
                                        i--;
                                    }
                                    if (!leftTile) {
                                        i = 1;
                                        while ((!leftTile) && (i < tile.x)) {
                                            leftTile = data.find(
                                                (_) => _.x === i && _.y === y && _.value === 0,
                                            );
                                            i++;
                                        }
                                    }
                                    if (leftTile && !(tile.value === 0 && leftTile.value === 0)) {
                                        data = data.map(
                                            (_) => {
                                                if (_.uid === leftTile!.uid) {
                                                    return {
                                                        ..._,
                                                        value: leftTile!.value + tile.value,
                                                    };
                                                } else if (_.uid === tile.uid) {
                                                    return {
                                                        ..._,
                                                        uid: this.uid++,
                                                        value: 0,
                                                    };
                                                } else {
                                                    return _;
                                                }
                                            },
                                        );
                                    }
                                }
                            }
                            break;
                        }
                    }
                    this.setState({ data });
                    this.newTile();
                });
            }
        }
    }
});
