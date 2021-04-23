import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import createSocketIoMiddleware from "redux-socket.io";
import socket from "../socket.io-config";
import playersReducer from "../features/playersSlice";
import tablesReducer from "../features/tablesSlice";
import seatsReducer from "../features/seatsSlice";
import { getServerState } from "../api-interface";

const socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const getStore = async () => {
  const preloadedState = await getServerState();
  const store = configureStore({
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
  return store;
};

export default getStore;
