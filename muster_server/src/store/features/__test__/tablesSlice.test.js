import tablesReducer, {
  createTable,
  removeTable,
} from "../tablesSlice";

test("Add and remove tables", () => {
  /**
   * Show that tables can be added and removed
   * and that the ids array remains sorted throughout.
   *
   * Show that holes from deleted tables don't get filled in.
   */
  const one_table_state = tablesReducer(undefined, createTable());
  const two_table_state = tablesReducer(one_table_state, createTable());
  const three_table_state = tablesReducer(two_table_state, createTable());
  expect(three_table_state).toEqual({
    entities: { 0: { id: 0 }, 1: { id: 1 }, 2: { id: 2 }, 3: { id: 3 } },
    ids: [0, 1, 2, 3],
  });
  const remove_table_two_state = tablesReducer(
    three_table_state,
    removeTable(2)
  );
  expect(remove_table_two_state).toEqual({
    entities: { 0: { id: 0 }, 1: { id: 1 }, 3: { id: 3 } },
    ids: [0, 1, 3],
  });
  const add_table_four_state = tablesReducer(
    remove_table_two_state,
    createTable()
  );
  // Adding tables does not fill gaps from removed tables.
  expect(add_table_four_state).toEqual({
    entities: { 0: { id: 0 }, 1: { id: 1 }, 3: { id: 3 }, 4: { id: 4 } },
    ids: [0, 1, 3, 4],
  });
  const remove_table_four_state = tablesReducer(
    add_table_four_state,
    removeTable(4)
  );
  expect(remove_table_four_state).toEqual(remove_table_two_state);
});
test("reducer won't delete table 0", () => {
  // type: "" is not, so far as I know, the actual initial action,
  // but it serves the same purpose.
  const initial_state = tablesReducer(undefined, { type: "" });
  const delete_zero_state = tablesReducer(initial_state, removeTable(0));
  expect(delete_zero_state).toEqual(initial_state);
});

test("removeTable action creator errors on deleting table 0", () => {
  const remove_zero_action = removeTable(0);
  expect(remove_zero_action).toHaveProperty("error", true);
});
