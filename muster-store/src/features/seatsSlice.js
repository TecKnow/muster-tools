import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { addPlayer, removePlayer } from "./playersSlice";
import { removeTable } from "./tablesSlice";
//TODO: factor seat moving logic into its own reducer utility function
//TODO: create moveSeat action that the server can broadcast

const seatsAdapter = createEntityAdapter();

const update_table = (table, tableId = undefined, starting_index = 0) => {
  /**
   * Update the position values of seat objects to match their positions
   * in the passed in list.
   *
   * TableId must be provided if players may be
   * moving between tables.  Otherwise, it takes the value of the first
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

const move_seat = (seat_entities, playerId, tableId, position) => {
  const destination_table = tableId;
  const destination_position = position;
  /** The key to this method is converting from an unordered list of
   * triples (player, table, position) to ordered sublists and back,
   * very carefully.
   * */
  // The action tells us where the user should end up assigned
  // Find where the player is currently assigned
  const { table: source_table, position: source_position } = find_player_seat(
    seat_entities,
    playerId
  );
  if (
    source_table === destination_table &&
    source_position === destination_position
  ) {
    // Move already accomplished.
    // This probably means the move was initiated from this client and
    // provisionally enacted by the assignSeat thunk.
    return;
  }
  // Select all assignments at the source table into a sorted array
  const source_table_list = find_table(seat_entities, source_table);
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
  const destination_table_list = find_table(seat_entities, destination_table);
  // console.log("Original destination table list", JSON.stringify(destination_table_list));
  // Manipulate the ordered lists using slice mechanisms as normal
  destination_table_list.splice(destination_position, 0, removed);
  // console.log("updated destination table list", JSON.stringify(destination_table_list));

  // Update the seat assignments at each table to match their array index.
  update_table(destination_table_list, destination_table);
  // console.log("Normalized destination list", JSON.stringify(destination_table_list));
};

const seat_sort_comparer = (a, b) =>
  a.table == b.table ? a.position - b.position : a.table - b.table;

export const fetchSeats = createAsyncThunk(
  "seats/fetchSeats",
  async (_, thunkApi) => {
    try {
      const api = thunkApi.extra;
      const dataFromServer = await api.selectAllSeats();
      const results = Array.prototype.map.call(dataFromServer, (seatRow) => ({
        id: seatRow.PlayerName,
        table: seatRow.TableIdentifier,
        position: seatRow.Position,
      }));
      return results;
    } catch (err) {
      thunkApi.rejectWithValue(err);
    }
  }
);

export const assignSeat = createAsyncThunk(
  "seats/assignSeat",
  async ({ player, table, position }, thunkApi) => {
    try {
      await api.assignSeat(player, table, position);
      return { player, table, position };
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const seatsSlice = createSlice({
  name: "seats",
  initialState: seatsAdapter.getInitialState(),
  reducers: {
    moveSeat: {
      reducer: (state, action) => {
        const { player, table, position } = action.payload;
        move_seat(state.entities, player, table, position);
      },
      prepare: (player, table, position) => ({
        payload: { player, table, position },
      }),
    },
    resetSeats: (state) => {
      update_table(
        [...Object.values(state.entities)].sort(seat_sort_comparer),
        0
      );
    },
    shuffleZero: (state, action) => {
      const new_positions = action.payload;
      const table_zero_list = find_table(state.entities, 0);
      table_zero_list.forEach((element, index) => {
        element.position = new_positions[index];
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSeats.fulfilled, seatsAdapter.upsertMany);
    builder.addCase(assignSeat.pending, (state, action) => {
      const previous_seat = find_player_seat(
        state.entities,
        action.meta.arg.player
      );
      previous_seat.previous_position = previous_seat.position;
      previous_seat.previous_table = previous_seat.table;
      move_seat(
        state.entities,
        action.meta.arg.player,
        action.meta.arg.table,
        action.meta.arg.position
      );
    });
    builder.addCase(assignSeat.rejected, (state, action) => {
      move_seat(
        state.entities,
        action.meta.arg.player,
        state.entities[action.meta.arg.player].previous_table,
        state.entities[action.meta.arg.player].previous_position
      );
      delete state.entities[action.meta.arg.player].previous_table;
      delete state.entities[action.meta.arg.player].previous_position;
    });
    builder.addCase(assignSeat.fulfilled, (state, action) => {
      delete state.entities[action.meta.arg.player].previous_table;
      delete state.entities[action.meta.arg.player].previous_position;
    });
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

export const { moveSeat, resetSeats, shuffleZero } = seatsSlice.actions;

export const _default_reducer_path_fetch = (state) => state.seats;

let _reducer_path_fetch = _default_reducer_path_fetch;

export const _set_reducer_path_fetch = (
  fetch_function = _default_reducer_path_fetch
) => {
  _reducer_path_fetch = fetch_function;
};

export const {
  selectAll: selectAllSeats,
  selectById: selectSeatById,
  selectIds: selectSeatIds,
} = seatsAdapter.getSelectors(_reducer_path_fetch);

export const selectTableSeats = (state, tableId) => {
  const seats = Object.values(_reducer_path_fetch(state).entities);
  return Object.values(seats).filter((seat) => seat.table == tableId);
};

export const selectPlayerSeat = (state, playerName) =>
  _reducer_path_fetch(state).entities[playerName];

export default seatsSlice.reducer;
