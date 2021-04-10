import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import logger from "redux-logger";
import createSocketIoMiddleware from "redux-socket.io";
import socket from "../socket.io-config";
import playersReducer from "./features/playersSlice";
import tablesReducer from "./features/tablesSlice";
import seatsReducer from "./features/seatsSlice";

const socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const store = configureStore({
  reducer: {
    counter: counterReducer,
    players: playersReducer,
    tables: tablesReducer,
    Seats: seatsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    let res = getDefaultMiddleware();
    res = res.concat(socketIoMiddleware);
    if (process.env.NODE_ENV === "development") {
      res = res.concat(logger);
    }
    return res;
  },
});

export default store;
