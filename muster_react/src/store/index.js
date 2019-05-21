import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux-immutable";
import { createLogger } from "redux-logger";
import ReduxThunk from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { reducer as form } from "redux-form/immutable";
import immutableActionMiddleware from "./immutable-action-middleware";
import KnownPlayers from "./ducks/known-players";
import CurrentPlayers from "./ducks/current-players";
import Tables, { reduceResetTables } from "./ducks/tables";
import { loadState, UseLocalStorage } from "./localStorage";

export const middlewareList = [
  ReduxThunk,
  promiseMiddleware,
  immutableActionMiddleware
];
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  middlewareList.push(createLogger());
}

const mergedReducer = combineReducers({
  KnownPlayers,
  CurrentPlayers,
  Tables,
  form
});

export const rootReducer = (state, action) => {
  state = mergedReducer(state, action);
  // TODO: Implement a better system for dealing with these cross-module reducers.
  state = reduceResetTables(state, action);
  return state;
};

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
export const store = createMiddlwareStore(rootReducer, persistedState); //persistedState

UseLocalStorage(store);
