import { skip } from "rxjs/operators";
import Game2048 from "./game";

describe(Game2048, () => {
    it(`should create board`, () => {
        const board = new Game2048(4);
        expect(board).toBeDefined();
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

    it(`data$ should emit current tiles`, (done) => {
        const board = new Game2048(2);
        const { data } = board;
        board.data$.subscribe((value) => {
            expect(value).toEqual(data);
            done();
        });
    }, 1000);

    it(`${Game2048.prototype.move.name} should push values to data$`, (done) => {
        const board = new Game2048(2);
        const { data } = board;
        board.data$.pipe(skip(1)).subscribe((value) => {
            expect(value).not.toEqual(data);
            done();
        });
        board.move({ x: 1, y: 0 });
    }, 1000);
});
