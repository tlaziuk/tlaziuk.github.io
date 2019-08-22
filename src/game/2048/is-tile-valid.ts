import { ITile } from "./tile";

export default function isTileValid(
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
