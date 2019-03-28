// tslint:disable:max-line-length
/**
 * slightly modified version of https://github.com/redux-observable/redux-observable/blob/v1.0.0/src/createEpicMiddleware.js
 *
 * exposed `store$` and `action$`
 */

import { Action, Middleware, MiddlewareAPI } from "redux";
import { ActionsObservable, Epic, StateObservable } from "redux-observable";
import { from, queueScheduler, Subject } from "rxjs";
import { map, mergeMap, observeOn, subscribeOn } from "rxjs/operators";

export default function createEpicMiddleware<Input extends Action, Output extends Input = Input, State = void, Dependencies = any>(
  options: { dependencies?: Dependencies } = {},
) {
  const epic$ = new Subject<Epic<Input, Output, State, Dependencies>>();
  let store: MiddlewareAPI;
  let action$: ActionsObservable<Input>;
  let state$: StateObservable<State>;

  const middleware = Object.assign(
    ((middlewareAPI) => {
      if (store || action$ || state$) {
        throw new Error("This middleware is already associated with a store.");
      }
      store = middlewareAPI;
      const actionSubject$ = new Subject<Input>().pipe(
        observeOn(queueScheduler),
      ) as Subject<Input>;
      const stateSubject$ = new Subject<State>().pipe(
        observeOn(queueScheduler),
      ) as Subject<State>;
      action$ = new ActionsObservable(actionSubject$);
      state$ = new StateObservable(stateSubject$, store.getState());

      const result$ = epic$.pipe(
        map((epic) => {
          const output$ = epic(action$, state$, options.dependencies as any);

          if (!output$) {
            throw new TypeError(`Your root Epic "${epic.name || "<anonymous>"}" does not return a stream.`);
          }

          return output$;
        }),
        mergeMap((output$) =>
          from(output$).pipe(
            subscribeOn(queueScheduler),
            observeOn(queueScheduler),
          ),
        ),
      );

      result$.subscribe(store.dispatch);

      return (next) => {
        return (action) => {
          // Downstream middleware gets the action first,
          // which includes their reducers, so state is
          // updated before epics receive the action
          const result = next(action);

          // It's important to update the state$ before we emit
          // the action because otherwise it would be stale
          stateSubject$.next(store.getState());
          actionSubject$.next(action);

          return result;
        };
      };
    }) as Middleware,
    {
      run: (rootEpic: Epic<Input, Output, State, Dependencies>) => {
        epic$.next(rootEpic);
      },
    },
  );

  Object.defineProperties(
    middleware,
    {
      action$: {
        get: () => {
          if (!action$) {
            throw new Error("This middleware is not associated with a store yet.");
          }
          return action$;
        },
      },
      state$: {
        get: () => {
          if (!state$) {
            throw new Error("This middleware is not associated with a store yet.");
          }
          return state$;
        },
      },
    },
  );

  return middleware as (typeof middleware) & {
    readonly action$: typeof action$,
    readonly state$: typeof state$,
  };
}
