import getFarthestTile from "./get-farthest-tile";
import getTile from "./get-tile";
import { ITile } from "./tile";

describe(getFarthestTile, () => {
    it(`should return proper farthest tile with same value`, () => {
        const board: ReadonlyArray<Readonly<ITile>> = [
            {
                uid: "a",
                value: 1,
                x: 1,
                y: 1,
            },
            {
                uid: "b",
                value: 0,
                x: 2,
                y: 1,
            },
            {
                uid: "c",
                value: 2,
                x: 3,
                y: 1,
            },
            {
                uid: "d",
                value: 1,
                x: 1,
                y: 2,
            },
            {
                uid: "e",
                value: 1,
                x: 2,
                y: 2,
            },
            {
                uid: "f",
                value: 0,
                x: 3,
                y: 2,
            },
            {
                uid: "g",
                value: 1,
                x: 1,
                y: 3,
            },
            {
                uid: "h",
                value: 0,
                x: 2,
                y: 3,
            },
            {
                uid: "i",
                value: 0,
                x: 3,
                y: 3,
            },
        ];

        /**
         * y3 1(g) 0(h) 0(i)
         * y2 1(d) 1(e) 0(f)
         * y1 1(a) 0(b) 2(c)
         *    x1   x2   x3
         */

        expect(getFarthestTile(getTile(1, 1, board)!, { x: 0, y: 0 } as any, board).uid).toBe("a");
        expect(getFarthestTile(getTile(1, 1, board)!, { x: 1, y: 0 }, board).uid).toBe("b");
        expect(getFarthestTile(getTile(1, 1, board)!, { x: -1, y: 0 }, board).uid).toBe("a");
        expect(getFarthestTile(getTile(3, 1, board)!, { x: 1, y: 0 }, board).uid).toBe("c");
        expect(getFarthestTile(getTile(3, 1, board)!, { x: -1, y: 0 }, board).uid).toBe("b");
        expect(getFarthestTile(getTile(1, 1, board)!, { x: 0, y: 1 }, board).uid).toBe("d");
        expect(getFarthestTile(getTile(1, 2, board)!, { x: 0, y: 1 }, board).uid).toBe("g");
        expect(getFarthestTile(getTile(1, 2, board)!, { x: 1, y: 0 }, board).uid).toBe("e");
        expect(getFarthestTile(getTile(2, 2, board)!, { x: 1, y: 0 }, board).uid).toBe("f");
        expect(getFarthestTile(getTile(1, 3, board)!, { x: 1, y: 0 }, board).uid).toBe("i");
    });
});
