// tslint:disable:object-literal-sort-keys

import { ComponentType } from "react";
import { distinctUntilChanged, map } from "rxjs/operators";
import UniversalRouter, { Context } from "universal-router";
import HomeComponent from "./home";
import { router$ } from "./store";

const router = new UniversalRouter<Context, ComponentType<any>>(
    [
        {
            path: "",
            action: () => HomeComponent,
            name: "homepage",
        },
    ],
    {
        errorHandler: () => HomeComponent,
    },
);

export default router;

export const resolvedRoute$ = router$.pipe(
    distinctUntilChanged(
        (
            { hash: xHash, pathname: xPathname, search: xSearch },
            { hash: yHash, pathname: yPathname, search: ySearch },
        ) => xHash === yHash && xPathname === yPathname && xSearch === ySearch,
    ),
    map(
        ({ pathname }) => router.resolve(pathname),
    ),
);
