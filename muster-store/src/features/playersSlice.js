import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { systemReset } from "./systemActions";

const playersAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.id && b.id && String.prototype.localeCompare.call(a.id, b.id),
});

export const fetchPlayers = createAsyncThunk(
  "players/fetchPlayers",
  async (_, thunkApi) => {
    const api = thunkApi.extra;
    const dataFromServer = await api.selectAllPlayers();
    const result = Array.prototype.map.call(dataFromServer, (playerRow) => ({
      id: playerRow.Name,
    }));
    return result;
  }
);

export const enrollPlayer = createAsyncThunk(
  "players/enrollPlayer",
  async ({ name }, thunkApi) => {
    const api = thunkApi.extra;
    const dataFromServer = await api.addPlayer(name);
    return;
  }
);

export const deletePlayer = createAsyncThunk(
  "players/deletePlayer",
  async ({ playerName }, { extra: api }) => {
    const responseFromServer = await api.deletePlayer(playerName);
    return;
  }
);

const initialState = playersAdapter.getInitialState();

export const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    addPlayer: {
      reducer: playersAdapter.addOne,
      prepare: (name) => ({
        payload: { id: name },
      }),
    },
    removePlayer: playersAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlayers.fulfilled, playersAdapter.upsertMany);
    builder.addCase(systemReset, (state, action) => {
      return initialState;
    });
  },
});

export const { addPlayer, removePlayer } = playersSlice.actions;

export const {
  selectAll: selectAllPlayers,
  selectById: selectPlayerById,
  selectIds: selectPlayerIds,
} = playersAdapter.getSelectors((state) => state.players);

export default playersSlice.reducer;
