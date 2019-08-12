import Game2048 from "./index";

describe(Game2048, () => {
    it(`should create board`, () => {
        const board = new Game2048(4);
        expect(board).toBeDefined();
    });

    it(`${Game2048.prototype.getTile.name} should return a tile`, () => {
        const board = new Game2048(4);
        expect(board.getTile(1, 1)).toBeDefined();
        expect(board.getTile(4, 4)).toBeDefined();
        expect(board.getTile(0, 0)).toBeUndefined();
        expect(board.getTile(5, 5)).toBeUndefined();
    });

    it(`${Game2048.prototype.set.name} should set a new game board`);

    it(`${Game2048.prototype.getFarthestTile.name} should return proper farthest tile with same value`);
});
