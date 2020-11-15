import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import logger from "redux-logger";
import createSocketIoMiddleware from "redux-socket.io";
import io from "socket.io-client";
let socket = io("http://localhost:3000");
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const store = configureStore({
  reducer: {
    counter: counterReducer,
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

store.subscribe();
