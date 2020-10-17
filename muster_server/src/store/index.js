import { configureStore } from "@reduxjs/toolkit";
import createSocketIoMiddleware from 'redux-socket.io'
import logger from "redux-logger";
import {io} from "../express-app";

const socketIoMiddleware = createSocketIoMiddleware(io, "");

import playersReducer from "./features/playersSlice";
export default configureStore({
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
