import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux-immutable";
import { createLogger } from "redux-logger";
//import ReduxThunk from "redux-thunk";
import promiseMiddleware from "redux-promise";
import { reducer as form } from "redux-form/immutable";
import immutableActionMiddleware from "./immutable-action-middleware";
import { Players } from "./players/reducers";

export const middlewareList = [
  /*ReduxThunk,*/ promiseMiddleware,
  immutableActionMiddleware
];
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  middlewareList.push(createLogger());
}

export const rootReducer = combineReducers({
  Players,
  form
});

export function createMiddlwareStore(rootReducer, ...rest) {
  return createStore(rootReducer, applyMiddleware(...middlewareList), ...rest);
}

export const store = createMiddlwareStore(rootReducer);
