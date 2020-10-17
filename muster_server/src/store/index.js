import { configureStore } from "@reduxjs/toolkit";
import createSocketIoMiddleware from 'redux-socket.io'
import logger from "redux-logger";
import {io} from "../express-app";
import store_writer from "./write_store";

const socketIoMiddleware = createSocketIoMiddleware(io, "");

import playersReducer from "./features/playersSlice";
export const store = configureStore({
  reducer: {
    players: playersReducer,
  },
  middleware: (getDefaultMiddleware) => {
    let res = getDefaultMiddleware()
    res = res.concat(socketIoMiddleware);
    if(process.env.NODE_ENV === "development"){
      res = res.concat(logger);
    }
    return res;
  },
});

export const writer = (process.env.NODE_ENV != "test" ? store_writer()(store) : null);

export default store;