import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

export const systemReset = createAction("systemReset");

export const systemResetServer = createAsyncThunk(
  "systemResetServer",
  async (_, { extra: api }) => {
    const responseFromServer = await api.resetSystem();
    return;
  }
);
