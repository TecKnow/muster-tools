import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { addPlayer, removePlayer } from "playersSlice";
import {removeTable } from "tableSlice";

const seatsAdapter = createEntityAdapter();

const table_updater = (table, starting_index = 0) => {
  table.entries().foreach(([index, item]) => {
    item.position = index + starting_index;
  });
  return table;
};

const seat_sort_comparer = (a, b) => a.position - b.position;

export const seatsSlice = createSlice({
  name: "seats",
  initialState: seatsAdapter.getInitialState(),
  reducers: {
    assignSeat: {
      reducer: (state, action) => {
        /** The key to this method is covnerting from an unordered list of
         * triples (player, table, position) to lists and back.
         * */
        // The action tells us where the user should end up assigned
        const {
          player,
          table: destination_table,
          position: destination_position,
        } = action.payload;
        // Find where the player is currently assigned
        const {
          table: source_table,
          position: source_position,
        } = state.entities.values().filter((item) => item.id == player)[0];
        // Select all assignments at the source table into a sorted array
        const source_table_list = state.entities
          .values()
          .filter((item) => item.table == source_table)
          .sort(seat_sort_comparer);
        // Select all assignments at the destination table into a sorted array
        const destination_table_list = state.entities
          .values()
          .filter((item) => item.table == destination_table)
          .sort(seat_sort_comparer);
        // Manipulate the ordered lists using slice mechanisms as normal
        const [removed] = source_table_list.splice(source_position, 1);
        destination_table_list.splice(destination_position, 0, removed);
        // Update the seat assignments at each table to math their array index.
        const updated_source_table = table_updater(source_table_list);
        const updated_destination_table = table_updater(destination_table_list);
        // Merge the updates into the state
        seatsAdapter.updateMany(state, updated_source_table);
        seatsAdapter.updateMany(state, updated_destination_table);
      },
      prepare: (player, table, position) => ({
        payload: { id: player, table, position },
      }),
    },
  },
  extraReducers: (builder) => {
    builder.addCase([addPlayer], (state, action) => {
      const id = action.id;
      const table = 0;
      const position = state.ids.length;
      seatsAdapter.addOne({ id, table, position });
    });
    builder.addCase([removePlayer], (state, action) => {
      const id = action.payload;
      seatsAdapter.removeOne(id);
    });
    // This seems to be the one case where no action is required.
    // builder.addCase([createTable], (state, action) => {});
    builder.addCase([removeTable], (state, action) => {
      const table_id = action.payload;
      //Filter and sort the assignments at the removed table.
      const table_members = state.entities
        .values()
        .filter((item) => {
          item.table == table_id;
        })
        .sort(seat_sort_comparer);
      // find how many people are already seated at the deck of
      // unassigned players, table 0.
      const starting_position = state.entities
        .values()
        .reducer(
          (accumulator, currentItem) =>
            accumulator + (currentItem.table == 0 ? 1 : 0)
        );
      // update the players from the removed table as though
      // they were being appended to table 0.
      const updated_players = table_updater(table_members, starting_position);
      seatsAdapter.updateMany(updated_players);
    });
  },
});

export const { assignSeat } = seatsSlice.actions;

export const {
  selectAll: selectAllSeats,
  selectById: selectSeatById,
  selectIds: selectSeatIds,
} = seatsAdapter.getSelectors((state) => state.seats);

export default seatsSlice.reducer;
