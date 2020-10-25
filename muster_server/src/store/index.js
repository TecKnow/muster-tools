import { configureStore } from "@reduxjs/toolkit";
import createSocketIoMiddleware from "redux-socket.io";
import logger from "redux-logger";
import { io } from "../express-app";
import { store_writer, store_reader } from "./serialize_store";
import playersReducer from "./features/playersSlice";
import tablesReducer from "./features/tablesSlice";
import seatsReducer from "./features/seatsSlice";

const socketIoMiddleware = createSocketIoMiddleware(io, "");

const makeStore = () => {
  const preloadedState = store_reader();
  return configureStore({
    reducer: {
      players: playersReducer,
      tables: tablesReducer,
      seats: seatsReducer,
    },
    middleware: (getDefaultMiddleware) => {
      let res = getDefaultMiddleware();
      res = res.concat(socketIoMiddleware);
      if (process.env.NODE_ENV === "development") {
        res = res.concat(logger);
      }
      return res;
    },
    preloadedState,
  });
};

export const store = makeStore();
export const writer = (async (store) => {
  const writer = store_writer()(await store);
  return writer;
})(store);
export default store;
