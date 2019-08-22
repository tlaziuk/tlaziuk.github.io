import { ITile } from "./tile";

export default function getTile(
    x: ITile["x"],
    y: ITile["y"],
    data: ReadonlyArray<Readonly<ITile>>,
) {
    return data.find((_) => _.x === x && _.y === y);
}
