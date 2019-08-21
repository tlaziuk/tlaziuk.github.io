import uuid from "uuid/v4";
import { ITile } from "./tile";

/**
 * adds a new/random tile to the board
 */
export default function addRandomTile(
    data: ReadonlyArray<Readonly<ITile>>,
): typeof data {
    const zeroValueTiles = data.filter(({ value }) => value === 0);

    if (zeroValueTiles.length === 0) {
        throw new Error("can not add a new tile");
    }

    const tileUid = zeroValueTiles[Math.floor(Math.random() * zeroValueTiles.length)].uid;

    return data.map(
        (tile) => tile.uid === tileUid ? { ...tile, value: 1, uid: uuid() } : tile,
    );
}
