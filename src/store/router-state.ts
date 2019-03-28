import { map } from "rxjs/operators";
import { state$ } from "./redux";

export default state$.pipe(
  map(
    ({ router }) => router,
  ),
);
