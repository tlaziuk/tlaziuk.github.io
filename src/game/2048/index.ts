import { BehaviorSubject } from "rxjs";
import uuid from "uuid/v4";

interface ITile {
    readonly x: number;
    readonly y: number;
    readonly value: number;
    readonly uid: string;
}

type IVector = {
    readonly x: 1;
    readonly y: 0;
} | {
    readonly x: -1;
    readonly y: 0;
} | {
    readonly x: 0;
    readonly y: 1;
} | {
    readonly x: 0;
    readonly y: -1;
};

const enum GameState {
    Playing,
    Won,
    Lost,
}

function isTileValid(
    tile: Readonly<ITile>,
    tiles: ReadonlyArray<Readonly<ITile>>,
): boolean {
    if (typeof tile.x !== "number") {
        return false;
    }

    if (typeof tile.y !== "number") {
        return false;
    }

    if (typeof tile.value !== "number" || Number.isNaN(tile.value)) {
        return false;
    }

    if (typeof tile.uid !== "string") {
        return false;
    }

    if (!tiles.includes(tile) || tiles.filter(
        (_) => _ === tile || _.uid === tile.uid || (_.x === tile.x && _.y === tile.y),
    ).length > 1) {
        return false;
    }

    return true;
}

export default class Game2048 {
    public get data() {
        return this.data$.getValue();
    }

    private readonly data$ = new BehaviorSubject<ReadonlyArray<Readonly<ITile>>>(
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

    public getTile(x: ITile["x"], y: ITile["y"]) {
        return this.data.find((_) => _.x === x && _.y === y);
    }

    /**
     * get farthest tile to given tile which value is equal to the value of the given tile,
     * or farthest tile which value is equal `0`,
     * otherwise get given tile if above conditions could not be meet
     *
     * @returns farthest tile
     */
    public getFarthestTile(tile: Readonly<ITile>, { x: vectorX, y: vectorY }: IVector): Readonly<ITile> {
        if (vectorX === vectorY) {
            return tile;
        }

        const { value: originalValue } = tile;

        let farthestTile: ReturnType<Game2048["getTile"]> = tile;

        do {
            ([tile, farthestTile] = [
                farthestTile,
                this.getTile(farthestTile.x + vectorX, farthestTile.y + vectorY),
            ]);

            if (farthestTile && farthestTile.value === originalValue) {
                return farthestTile;
            }
        } while (
            farthestTile
            && farthestTile.value === 0
        );

        return tile;
    }

    /**
     * set the board to given data
     */
    public set(data: Game2048["data"]) {
        if (data.length !== (this.size ** 2)) {
            throw new Error("not enough tiles");
        }

        for (const tile of data) {
            if (!isTileValid(tile, data)) {
                throw new Error(`tile is invalid: ${JSON.stringify(tile)}`);
            }
        }

        this.data$.next(data);

        this.state = GameState.Playing;
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

        this.data$.next(data);
    }
}
