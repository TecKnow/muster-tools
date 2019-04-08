import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux-immutable";
import { createLogger } from "redux-logger";
//import ReduxThunk from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { reducer as form } from "redux-form/immutable";
import immutableActionMiddleware from "./immutable-action-middleware";
import KnownPlayers from "./ducks/known-players";
import CurrentPlayers from "./ducks/current-players";
import { loadState, saveState } from "./localStorage";
import { throttle } from "lodash";

export const middlewareList = [
  /*ReduxThunk,*/ promiseMiddleware,
  immutableActionMiddleware
];
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  middlewareList.push(createLogger());
}

export const rootReducer = combineReducers({
  KnownPlayers,
  CurrentPlayers,
  form
});

export function createMiddlwareStore(
  rootReducer,
  initialState = undefined,
  ...rest
) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewareList),
    ...rest
  );
}

const persistedState = loadState();
console.log("Persisted state", persistedState);
export const store = createMiddlwareStore(rootReducer, persistedState);

store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);
