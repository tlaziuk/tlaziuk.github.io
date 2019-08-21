import { ITile } from "./tile";
import { IVector } from "./vector";

/**
 * get farthest tile to given tile which value is equal to the value of the given tile,
 * or farthest tile which value is equal `0`,
 * otherwise get given tile if above conditions could not be meet
 *
 * @returns farthest tile
 */
export default function getFarthestTile(
    tile: Readonly<ITile>,
    { x: vectorX, y: vectorY }: IVector,
    data: ReadonlyArray<Readonly<ITile>>,
): Readonly<ITile> {
    if (vectorX === vectorY) {
        return tile;
    }

    const { value: originalValue } = tile;

    let farthestTile: Readonly<ITile> = tile;

    do {
        ([tile, farthestTile] = [
            farthestTile,
            this.getTile(farthestTile.x + vectorX, farthestTile.y + vectorY, data),
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
