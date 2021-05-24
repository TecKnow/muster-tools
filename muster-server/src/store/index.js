import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import {
  playersSlice,
  tablesSlice,
  seatsSlice,
} from "@grumbleware/event-muster-store";

export const _makeStore = (initial_state) => {
  const preloadedState = initial_state;
  return configureStore({
    reducer: {
      players: playersSlice.reducer,
      tables: tablesSlice.reducer,
      seats: seatsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      let res = getDefaultMiddleware();
      if (process.env.NODE_ENV === "development") {
        res = res.concat(logger);
      }
      return res;
    },
    preloadedState,
  });
};

export const store = _makeStore();
export default store;
