import playersReducer, { addPlayer, removePlayer } from "../playersSlice";

const initial_state = playersReducer.initial_state;

test("add and remove players", () => {
  /**
   * Demonstrate that players can be added and removed,
   * and that the Ids array remains sorted throughout.
   */
  const add_alice_state = playersReducer(initial_state, addPlayer("Alice"));
  expect(add_alice_state).toEqual({
    ids: ["Alice"],
    entities: { Alice: { id: "Alice" } },
  });
  const add_charlie_state = playersReducer(
    add_alice_state,
    addPlayer("Charlie")
  );
  expect(add_charlie_state).toEqual({
    ids: ["Alice", "Charlie"],
    entities: { Alice: { id: "Alice" }, Charlie: { id: "Charlie" } },
  });
  const add_bob_state = playersReducer(add_charlie_state, addPlayer("Bob"));
  expect(add_bob_state).toEqual({
    ids: ["Alice", "Bob", "Charlie"],
    entities: {
      Alice: { id: "Alice" },
      Charlie: { id: "Charlie" },
      Bob: { id: "Bob" },
    },
  });
  const add_duplicate_alice_state = playersReducer(
    add_bob_state,
    addPlayer("Alice")
  );
  expect(add_duplicate_alice_state).toEqual(add_bob_state);
  const remove_alice_state = playersReducer(
    add_bob_state,
    removePlayer("Alice")
  );
  expect(remove_alice_state).toEqual({
    ids: ["Bob", "Charlie"],
    entities: { Charlie: { id: "Charlie" }, Bob: { id: "Bob" } },
  });
});
