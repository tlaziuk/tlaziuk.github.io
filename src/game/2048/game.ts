import { BehaviorSubject } from "rxjs";
import uuid from "uuid/v4";
import { GameState } from "./game-state";
import getFarthestTile from "./get-farthest-tile";
import isTileValid from "./is-tile-valid";
import { ITile } from "./tile";
import { IVector } from "./vector";
import addRandomTile from "./add-random-tile";

export default class Game2048 {
    public get data() {
        return this.dataSubject.getValue();
    }

    public get data$() {
        return this.dataSubject.asObservable();
    }

    private readonly dataSubject = new BehaviorSubject<ReadonlyArray<Readonly<ITile>>>(
        Array(this.size ** 2).fill(undefined).map(
            (_, index) => ({
                uid: uuid(),
                value: 0,
                x: (index % this.size) + 1,
                y: Math.floor(index / this.size) + 1,
            }),
        ),
    );

    private state: GameState = GameState.Playing;

    constructor(
        public readonly size: number,
    ) { }

    public isOnBoard(x: ITile["x"], y: ITile["y"]) {
        return x >= 1 && x <= this.size && y >= 1 && y <= this.size;
    }

    /**
     * set the board to given data
     */
    public set(
        data: Game2048["data"],
    ) {
        if (data.length !== (this.size ** 2)) {
            throw new Error("not enough tiles");
        }

        for (const tile of data) {
            if (!isTileValid(tile, data)) {
                throw new Error(`tile is invalid: ${JSON.stringify(tile)}`);
            }
        }

        this.dataSubject.next(data);

        this.updateGameState();
    }

    public setTile(
        x: ITile["x"],
        y: ITile["y"],
        {
            value,
            uid = uuid(),
        }: Omit<ITile, "x" | "y" | "uid"> & Partial<Pick<ITile, "uid">>,
    ) {
        const tile: Readonly<ITile> = {
            uid,
            value,
            x,
            y,
        };
        const data = this.data.map(
            (_) => x === _.x && y === _.y ? tile : _,
        );

        if (!isTileValid(tile, data)) {
            throw new Error(`tile is invalid: ${JSON.stringify(tile)}`);
        }

        this.dataSubject.next(data);

        this.updateGameState();
    }

    public move(vector: IVector) {
        const { x: vectorX, y: vectorY } = vector;
        let { data } = this;

        for (const tile of data.slice().sort(
            (a, b) => {
                if (vectorX === -1) {
                    return a.x - b.x;
                }
                if (vectorX === 1) {
                    return b.x - a.x;
                }
                if (vectorY === -1) {
                    return a.y - b.y;
                }
                if (vectorY === 1) {
                    return b.y - a.y;
                }
                return 0;
            },
        )) {
            if (tile.value === 0) {
                continue;
            }

            const farthestTile = getFarthestTile(tile, vector, data);

            if (tile.uid === farthestTile.uid) {
                continue;
            }

            data = data.map(
                (_) => {
                    if (_.uid === tile.uid) {
                        return {
                            ..._,
                            uid: uuid(),
                            value: 0,
                        };
                    }

                    if (_.uid === farthestTile.uid) {
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
        try {
            data = addRandomTile(data);
        } catch {
            // pass
        }

        this.set(data);
    }

    private updateGameState() {
        const { data } = this;

        if (data.find(({ value }) => value === 2048)) {
            return this.state = GameState.Won;
        }

        if (data.filter(({ value }) => value === 0).length === 0) {
            return this.state = GameState.Lost;
        }

        return this.state = GameState.Playing;
    }
}
