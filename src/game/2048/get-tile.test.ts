import Game2048 from "./game";
import getTile from "./get-tile";

describe(getTile, () => {
    it(`should return a tile`, () => {
        const game = new Game2048(4);
        const { data } = game;

        expect(getTile(1, 1, data)).toBeDefined();
        expect(getTile(4, 4, data)).toBeDefined();
        expect(getTile(0, 0, data)).toBeUndefined();
        expect(getTile(5, 5, data)).toBeUndefined();
    });
});
