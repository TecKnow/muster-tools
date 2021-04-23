import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

const playersAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

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
});

export const { addPlayer, removePlayer } = playersSlice.actions;

export const {
  selectAll: selectAllPlayers,
  selectById: selectPlayerById,
  selectIds: selectPlayerIds,
} = playersAdapter.getSelectors((state) => state.players);

export default playersSlice.reducer;
