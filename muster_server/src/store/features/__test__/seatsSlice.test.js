import { addPlayer, removePlayer } from "../playersSlice";
import { removeTable } from "../tablesSlice";
import seatsSliceReducer, {
  assignSeat,
  selectTableSeats,
  selectPlayerSeat,
  seatsSlice,
} from "../seatsSlice";

const initial_state = seatsSliceReducer(undefined, "");
const four_player_starting_state = {
  ids: ["Alice", "Bob", "Charlie", "Dan"],
  entities: {
    Alice: { id: "Alice", table: 0, position: 0 },
    Bob: { id: "Bob", table: 0, position: 1 },
    Charlie: { id: "Charlie", table: 0, position: 2 },
    Dan: { id: "Dan", table: 0, position: 3 },
  },
};

const four_players_one_table_state = {
  ids: ["Alice", "Bob", "Charlie", "Dan"],
  entities: {
    Alice: { id: "Alice", table: 0, position: 0 },
    Bob: { id: "Bob", table: 0, position: 1 },
    Charlie: { id: "Charlie", table: 1, position: 1 },
    Dan: { id: "Dan", table: 1, position: 0 },
  },
};

test("Added players get seats at table 0", () => {
  const one_player_state = seatsSliceReducer(initial_state, addPlayer("Alice"));
  const two_player_state = seatsSliceReducer(
    one_player_state,
    addPlayer("Bob")
  );
  const three_player_state = seatsSliceReducer(
    two_player_state,
    addPlayer("Charlie")
  );
  const four_player_state = seatsSliceReducer(
    three_player_state,
    addPlayer("Dan")
  );
  expect(four_player_state).toEqual(four_player_starting_state);
});

test("Rearrange players in table 0", () => {
  const charlie_first_state = seatsSliceReducer(
    four_player_starting_state,
    assignSeat("Charlie", 0, 0)
  );
  expect(charlie_first_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: { id: "Alice", table: 0, position: 1 },
      Bob: { id: "Bob", table: 0, position: 2 },
      Charlie: { id: "Charlie", table: 0, position: 0 },
      Dan: { id: "Dan", table: 0, position: 3 },
    },
  });
});

test("move players from table 0 to another table", () => {
  // Players fall to the lowest open position when moved.
  const move_charlie_state = seatsSliceReducer(
    four_player_starting_state,
    assignSeat("Charlie", 1, 3)
  );
  expect(move_charlie_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: { id: "Alice", table: 0, position: 0 },
      Bob: { id: "Bob", table: 0, position: 1 },
      Charlie: { id: "Charlie", table: 1, position: 0 },
      Dan: { id: "Dan", table: 0, position: 2 },
    },
  });
  const move_dan_state = seatsSliceReducer(
    move_charlie_state,
    assignSeat("Dan", 1, 0)
  );
  expect(move_dan_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: { id: "Alice", table: 0, position: 0 },
      Bob: { id: "Bob", table: 0, position: 1 },
      Charlie: { id: "Charlie", table: 1, position: 1 },
      Dan: { id: "Dan", table: 1, position: 0 },
    },
  });
});

test("remove a player", () => {
  const remove_dan_state = seatsSliceReducer(
    four_players_one_table_state,
    removePlayer("Dan")
  );
  expect(remove_dan_state).toEqual({
    ids: ["Alice", "Bob", "Charlie"],
    entities: {
      Alice: { id: "Alice", table: 0, position: 0 },
      Bob: { id: "Bob", table: 0, position: 1 },
      Charlie: { id: "Charlie", table: 1, position: 0 },
    },
  });
});

test("remove a table", () => {
  const remove_table_state = seatsSliceReducer(
    four_players_one_table_state,
    removeTable(1)
  );
  expect(remove_table_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: { id: "Alice", table: 0, position: 0 },
      Bob: { id: "Bob", table: 0, position: 1 },
      Charlie: { id: "Charlie", table: 0, position: 3 },
      Dan: { id: "Dan", table: 0, position: 2 },
    },
  });
});

test("remove table 0", () => {
  const remove_table_zero_state = seatsSliceReducer(
    four_players_one_table_state,
    removeTable(0)
  );
  expect(remove_table_zero_state).toEqual(four_players_one_table_state);
});
