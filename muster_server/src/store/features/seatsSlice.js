import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { addPlayer, removePlayer } from "./playersSlice";
import { removeTable } from "./tablesSlice";

const seatsAdapter = createEntityAdapter();

const update_table = (table, tableId = undefined, starting_index = 0) => {
  /**
   * Update the position values of seat objects to match their positions
   * in the passed in list.
   *
   * TableId must be provided if players may be
   * moving between tables.  Otherwise, it takes teh value of the first
   * seat assignment in the list.
   */
  if (typeof tableId == "undefined") {
    tableId = table[0].table;
  }
  for (const [index, item] of table.entries()) {
    item.table = tableId;
    item.position = index + starting_index;
  }
  return table;
};

const find_table = (seat_entities, tableId) =>
  Object.values(seat_entities)
    .filter((item) => item.table == tableId)
    .sort(seat_sort_comparer);

const find_player_seat = (seat_entities, playerId) => seat_entities[playerId];

const seat_sort_comparer = (a, b) => a.position - b.position;

//TODO: #9 Add reset action.

export const seatsSlice = createSlice({
  name: "seats",
  initialState: seatsAdapter.getInitialState(),
  reducers: {
    assignSeat: {
      reducer: (state, action) => {
        /** The key to this method is converting from an unordered list of
         * triples (player, table, position) to ordered sublists and back,
         * very carefully.
         * */
        // The action tells us where the user should end up assigned
        const {
          id: player,
          table: destination_table,
          position: destination_position,
        } = action.payload;
        // Find where the player is currently assigned
        const {
          table: source_table,
          position: source_position,
        } = find_player_seat(state.entities, player);
        // Select all assignments at the source table into a sorted array
        const source_table_list = find_table(state.entities, source_table);
        // Pop the player who is going to move.
        // This removes them from the list, but not the entities object.
        // It is vital to set their table to null here
        // so the entities objects reflects that they have been poppped
        const [removed] = source_table_list.splice(source_position, 1);
        removed.table = null;
        removed.position = null;
        // console.log("Removed item", JSON.stringify(removed));
        update_table(source_table_list, source_table);
        // console.log("updated source table", JSON.stringify(source_table_list));
        // Select all assignments at the destination table into a sorted array
        const destination_table_list = find_table(
          state.entities,
          destination_table
        );
        // console.log("Original destination table list", JSON.stringify(destination_table_list));
        // Manipulate the ordered lists using slice mechanisms as normal
        destination_table_list.splice(destination_position, 0, removed);
        // console.log("updated destination table list", JSON.stringify(destination_table_list));

        // Update the seat assignments at each table to match their array index.
        update_table(destination_table_list, destination_table);
        // console.log("Normalized destination list", JSON.stringify(destination_table_list));
      },
      prepare: (player, table, position) => ({
        payload: { id: player, table, position },
      }),
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addPlayer, (state, action) => {
      const id = action.payload.id;
      const table = 0;
      const position = state.ids.length;
      seatsAdapter.addOne(state, { id, table, position });
    });
    builder.addCase(removePlayer, (state, action) => {
      const id = action.payload;
      const player_table_id = find_player_seat(state.entities, id).table;
      seatsAdapter.removeOne(state, id);
      //console.log("Inital table:", JSON.stringify(player_table));
      update_table(find_table(state.entities, player_table_id));
      // console.log("final table", JSON.stringify(updated_player_table));
      //seatsAdapter.updateMany(updated_player_table);
    });
    // This seems to be the one case where no action is required.
    // builder.addCase([createTable], (state, action) => {});
    builder.addCase(removeTable, (state, action) => {
      const table_id = action.payload;
      if (table_id == 0) {
        return state;
      }
      //Filter and sort the assignments at the removed table.
      const table_members = find_table(state.entities, table_id);
      // find how many people are already seated at the deck of
      // unassigned players, table 0.
      const starting_position = Object.values(state.entities).reduce(
        (accumulator, currentItem) =>
          accumulator + (currentItem.table == 0 ? 1 : 0),
        0
      );
      // update the players from the removed table as though
      // they were being appended to table 0.
      update_table(table_members, 0, starting_position);
    });
  },
});

export const { assignSeat } = seatsSlice.actions;

export const {
  selectAll: selectAllSeats,
  selectById: selectSeatById,
  selectIds: selectSeatIds,
} = seatsAdapter.getSelectors((state) => state.seats);

export const selectTableSeats = (state, tableId) =>
  Object.values(state.seats.entities).filter((seat) => seat.table == tableId);

export const selectPlayerSeat = (state, playerName) =>
  Object.values(state.seats.entities).filter((seat) => seat.id == playerName);

export default seatsSlice.reducer;
