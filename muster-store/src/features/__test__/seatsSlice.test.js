import configureMockStore from "redux-mock-store";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import { addPlayer, removePlayer } from "../playersSlice";
import { removeTable } from "../tablesSlice";
import seatsSliceReducer, {
  assignSeat,
  moveSeat,
  resetSeats,
  shuffleZero,
  selectTableSeats,
  selectPlayerSeat,
  _set_reducer_path_fetch,
} from "../seatsSlice";

beforeEach(() => {
  _set_reducer_path_fetch((state) => state);
});

afterEach(() => {
  _set_reducer_path_fetch();
});

const initial_state = seatsSliceReducer(undefined, {});
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
    moveSeat("Charlie", 0, 0)
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
    moveSeat("Charlie", 1, 3)
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
    moveSeat("Dan", 1, 0)
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

test("Shuffle action", () => {
  const shuffled_state = seatsSliceReducer(
    four_players_one_table_state,
    shuffleZero([1, 0])
  );
  expect(shuffled_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: { id: "Alice", table: 0, position: 1 },
      Bob: { id: "Bob", table: 0, position: 0 },
      Charlie: { id: "Charlie", table: 1, position: 1 },
      Dan: { id: "Dan", table: 1, position: 0 },
    },
  });
});

test("reset all seats", () => {
  const reset_state = seatsSliceReducer(
    four_players_one_table_state,
    resetSeats()
  );
  expect(reset_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: { id: "Alice", table: 0, position: 0 },
      Bob: { id: "Bob", table: 0, position: 1 },
      Charlie: { id: "Charlie", table: 0, position: 3 },
      Dan: { id: "Dan", table: 0, position: 2 },
    },
  });
});

test("selectTableSeats", () => {
  expect(selectTableSeats(four_player_starting_state, 0)).toEqual([
    { id: "Alice", position: 0, table: 0 },
    { id: "Bob", position: 1, table: 0 },
    { id: "Charlie", position: 2, table: 0 },
    { id: "Dan", position: 3, table: 0 },
  ]);
  expect(selectTableSeats(four_players_one_table_state, 1)).toEqual([
    { id: "Charlie", position: 1, table: 1 },
    { id: "Dan", position: 0, table: 1 },
  ]);
});
test("selectPlayerSeat", () => {
  expect(selectPlayerSeat(four_players_one_table_state, "Charlie")).toEqual({
    id: "Charlie",
    table: 1,
    position: 1,
  });
  expect(selectPlayerSeat(four_player_starting_state, "Alice")).toEqual({
    id: "Alice",
    table: 0,
    position: 0,
  });
});

describe("Thunks", () => {
  const mock_api = {};
  const mock_store = configureMockStore(
    getDefaultMiddleware({ thunk: { extraArgument: mock_api } })
  );

  describe("assignSeat", () => {
    test("success", async () => {
      // test-specific mock setup
      const mock_assign_seat = jest.fn();
      mock_assign_seat.mockReturnValueOnce(Promise.resolve({}));
      mock_api.assignSeat = mock_assign_seat;
      const store = mock_store(four_players_one_table_state);
      expect(store.getState()).toEqual(four_players_one_table_state);

      // Test actions emitted by the assignSeat thunk on the happy path
      await store.dispatch(
        assignSeat({ player: "Charlie", table: 0, position: 0 })
      );
      expect(mock_assign_seat).toHaveBeenCalledTimes(1);
      const results = store.getActions();
      // It is important to note that the payload for pending actions is undefined.
      // The argument to the thunk is in meta.arg instead.
      expect(results).toMatchObject([
        {
          meta: { arg: { player: "Charlie", position: 0, table: 0 } },
          payload: undefined,
          type: String(assignSeat.pending),
        },
        {meta: { arg: { player: "Charlie", position: 0, table: 0 } },
        payload: expect.any(Object),
        type: String(assignSeat.fulfilled)},
      ]);

      // test-specific teardown
      delete mock_api.mock_assign_seat;
    });
    test("failure", async () => {
      // test-specific mock setup
      const mock_assign_seat = jest.fn();
      mock_assign_seat.mockReturnValueOnce(Promise.reject({}));
      mock_api.assignSeat = mock_assign_seat;
      const store = mock_store(four_players_one_table_state);
      expect(store.getState()).toEqual(four_players_one_table_state);

      // Test actions emitted by the assignSeat thunk on failure.
      await store.dispatch(
        assignSeat({ player: "Charlie", table: 0, position: 0 })
      );
      expect(mock_assign_seat).toHaveBeenCalledTimes(1);
      const results = store.getActions();
      // It is important to note that the payload for pending actions is undefined.
      // The argument to the thunk is in meta.arg instead.
      expect(results).toMatchObject([
        {
          meta: { arg: { player: "Charlie", position: 0, table: 0 } },
          payload: undefined,
          type: String(assignSeat.pending),
        },
        {meta: { arg: { player: "Charlie", position: 0, table: 0 } },
        payload: expect.any(Object),
        type: String(assignSeat.rejected)},
      ]);

      // test-specific teardown
      delete mock_api.mock_assign_seat;
    });
  });
});
