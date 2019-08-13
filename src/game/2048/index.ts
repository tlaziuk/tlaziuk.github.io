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
    private data: ReadonlyArray<Readonly<ITile>> = Array(this.size ** 2).fill(undefined).map(
        (_, index) => ({
            uid: uuid(),
            value: 0,
            x: (index % this.size) + 1,
            y: Math.floor(index / this.size) + 1,
        }),
    );

    private state: GameState = GameState.Playing;

    constructor(
        public readonly size: number,
    ) { }

    public isOnBoard(x: ITile["x"], y: ITile["y"]) {
        return x >= 1 && x <= this.size && y >= 1 && y <= this.size;
    }

    public getTile(x: ITile["x"], y: ITile["y"]) {
        if (!this.isOnBoard(x, y)) {
            throw new Error(`coordinates ${JSON.stringify({ x, y })} are not on the board`);
        }

        return this.data.find((_) => _.x === x && _.y === y)!;
    }

    /**
     * @returns farthest tile to given tile which value is the same as the given tile
     */
    public getFarthestTile(tile: Readonly<ITile>, { x: vectorX, y: vectorY }: IVector): Readonly<ITile> {
        if (vectorX === 0 && vectorY === 0) {
            return tile;
        }

        let farthestTile = this.getTile(tile.x + vectorX, tile.y + vectorY);

        if (!farthestTile) {
            return tile;
        }

        while (farthestTile) {
            ([tile, farthestTile] = [farthestTile, this.getTile(farthestTile.x + vectorX, farthestTile.y + vectorY)]);
        }

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

        this.data = data;

        this.state = GameState.Playing;
    }
}
