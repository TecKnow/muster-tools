import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import createSocketIoMiddleware from "redux-socket.io";
import socket from "../socket.io-config";
import {
  tablesSlice,
  seatsSlice,
  playersSlice,
} from "@grumbleware/event-muster-store";
import { api } from "@grumbleware/event-muster-store";

const socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const getStore = async () => {
  const preloadedState = await api.getServerState();
  const store = configureStore({
    reducer: {
      players: playersSlice.reducer,
      tables: tablesSlice.reducer,
      seats: seatsSlice.reducer,
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
