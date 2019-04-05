// tslint:disable:object-literal-sort-keys

import { ComponentType } from "react";
import { distinctUntilChanged, map } from "rxjs/operators";
import UniversalRouter, { Context } from "universal-router";
import { router$ } from "./store";

const router = new UniversalRouter<Context, ComponentType<any>>(
    [
        {
            path: "/",
            action: () => import(/* webpackPreload: true */"./page/home").then((_) => _.default),
            name: "homepage",
        },
        {
            path: "/konami",
            action: () => import("./page/secret").then((_) => _.default),
            name: "konami",
        },
        {
            path: "/2048",
            action: () => import("./page/2048").then((_) => _.default),
            name: "2048",
        },
    ],
    {
        errorHandler: () => import("./page/home").then((_) => _.default),
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
