import { createSlice, nanoid } from "@reduxjs/toolkit";

export const playersSlice = createSlice({
  name: "players",
  initialState: [],
  reducers: {
    addPlayer: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (name) => {
        return {
          payload: {
            id: nanoid(),
            name,
          },
        };
      },
    },
    removePlayer: (state, action) => {
      const removal_index = state.indexOf(action.payload);
      if (removal_index >= 0) {
        state.splice(removal_index, 1);
      }
    },
  },
});

export const { addPlayer, removePlayer } = playersSlice.actions;

export const selectAllPlayers = (state) => state.players;

export default playersSlice.reducer;
