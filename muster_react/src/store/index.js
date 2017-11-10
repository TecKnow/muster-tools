import { createStore, applyMiddleware } from "redux";
import combineReducers from "redux-immutable";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import promiseMiddleware from "redux-promise";

const middleware = [thunk, promiseMiddleware];
if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}

export function rootReducer() {}

export const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);
