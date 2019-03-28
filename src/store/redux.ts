import { createHashHistory } from "history";
import { AnyAction, applyMiddleware, combineReducers, compose as composeRedux, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware, routerReducer, startListener } from "redux-first-routing";
import { combineEpics } from "redux-observable";
import createEpicMiddleware from "../util/create-epic-middleware";
import { IState } from "./interface";

const compose: typeof composeRedux = process.env.NODE_ENV === "production" ? composeRedux : composeWithDevTools as any;

const history = createHashHistory();

const rootEpic = combineEpics<AnyAction, AnyAction, IState>();

const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, IState>();

const store: Store<IState> = createStore(
    combineReducers({
        router: routerReducer,
    }),
    {},
    compose(
        applyMiddleware(
            routerMiddleware(history),
            epicMiddleware,
        ),
    ),
);

epicMiddleware.run(rootEpic);

startListener(history, store);

export const { state$, action$ } = epicMiddleware;

export default store;
