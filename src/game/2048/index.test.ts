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

    it(`${Game2048.prototype.set.name} should set a new game board`, () => {
        const board = new Game2048(2);
        expect(() => { board.set([]); }).toThrow();
        expect(() => {
            board.set([
                {
                    uid: "a",
                    value: 0,
                    x: 1,
                    y: 1,
                },
                {
                    uid: "a",
                    value: 0,
                    x: 1,
                    y: 1,
                },
                {
                    uid: "a",
                    value: 0,
                    x: 1,
                    y: 1,
                },
                {
                    uid: "a",
                    value: 0,
                    x: 1,
                    y: 1,
                },
            ]);
        }).toThrow();
        expect(() => {
            board.set([
                {
                    uid: "a",
                    value: 0,
                    x: 1,
                    y: 1,
                },
                {
                    uid: "b",
                    value: 0,
                    x: 1,
                    y: 1,
                },
                {
                    uid: "c",
                    value: 0,
                    x: 1,
                    y: 1,
                },
                {
                    uid: "d",
                    value: 0,
                    x: 1,
                    y: 1,
                },
            ]);
        }).toThrow();
        expect(() => {
            board.set([
                {
                    uid: "a",
                    value: 0,
                    x: 1,
                    y: 1,
                },
                {
                    uid: "b",
                    value: 0,
                    x: 1,
                    y: 2,
                },
                {
                    uid: "c",
                    value: 0,
                    x: 2,
                    y: 1,
                },
                {
                    uid: "d",
                    value: 0,
                    x: 2,
                    y: 2,
                },
            ]);
        }).not.toThrow();
    });

    it(`${Game2048.prototype.getFarthestTile.name} should return proper farthest tile with same value`, () => {
        const board = new Game2048(3);
        /**
         * 1(a) 0(b) 2(c)
         * 0(d) 0(e) 0(f)
         * 1(g) 0(h) 0(i)
         */
        board.set([
            {
                uid: "a",
                value: 1,
                x: 1,
                y: 1,
            },
            {
                uid: "b",
                value: 0,
                x: 1,
                y: 2,
            },
            {
                uid: "c",
                value: 2,
                x: 1,
                y: 3,
            },
            {
                uid: "d",
                value: 0,
                x: 2,
                y: 1,
            },
            {
                uid: "e",
                value: 0,
                x: 2,
                y: 2,
            },
            {
                uid: "f",
                value: 0,
                x: 2,
                y: 3,
            },
            {
                uid: "g",
                value: 0,
                x: 3,
                y: 1,
            },
            {
                uid: "h",
                value: 0,
                x: 3,
                y: 2,
            },
            {
                uid: "i",
                value: 1,
                x: 3,
                y: 3,
            },
        ]);
        expect(board.getFarthestTile(board.getTile(1, 1)!, { x: 0, y: 0 } as any).uid).toBe("a");
        expect(board.getFarthestTile(board.getTile(1, 1)!, { x: 0, y: 1 }).uid).toBe("g");
        expect(board.getFarthestTile(board.getTile(1, 1)!, { x: 1, y: 0 }).uid).toBe("g");
        expect(board.getFarthestTile(board.getTile(1, 2)!, { x: 0, y: -1 }).uid).toBe("b");
        expect(board.getFarthestTile(board.getTile(1, 3)!, { x: 0, y: 1 }).uid).toBe("c");
        expect(board.getFarthestTile(board.getTile(3, 1)!, { x: 0, y: -1 }).uid).toBe("g");
        expect(board.getFarthestTile(board.getTile(3, 1)!, { x: 0, y: 1 }).uid).toBe("i");
        expect(board.getFarthestTile(board.getTile(1, 3)!, { x: -1, y: 0 }).uid).toBe("b");
    });
});
