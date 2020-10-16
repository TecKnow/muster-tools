import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import playersReducer from "./features/playersSlice";
export default configureStore({
  reducer: {
    players: playersReducer,
  },
  middleware: (getDefaultMiddleware) => {
    let res = getDefaultMiddleware()
    if(process.env.NODE_ENV === "development"){
      res = res.concat(logger);
    }
    return res;
  },
});
