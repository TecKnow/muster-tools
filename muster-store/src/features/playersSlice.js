import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const playersAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

export const fetchPlayers = createAsyncThunk(
  "players/fetchPlayers",
  async (_, thunkApi) => {
    try {
      const api = thunkApi.extra;
      const dataFromServer = await api.selectAllPlayers();
      const result = Array.prototype.map.call(dataFromServer, (playerRow) => ({
        id: playerRow.Name,
      }));
      return result;
    } catch (err) {
      thunkApi.rejectWithValue(err);
    }
  }
);

export const playersSlice = createSlice({
  name: "players",
  initialState: playersAdapter.getInitialState(),
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
  },
});

export const { addPlayer, removePlayer } = playersSlice.actions;

export const {
  selectAll: selectAllPlayers,
  selectById: selectPlayerById,
  selectIds: selectPlayerIds,
} = playersAdapter.getSelectors((state) => state.players);

export default playersSlice.reducer;
