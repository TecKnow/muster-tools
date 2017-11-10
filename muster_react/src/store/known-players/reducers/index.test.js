import { Map } from "immutable";
import { createStore } from "redux";
import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";
import KnownPlayers from "./index.js";

chai.use(chaiImmutable);

describe("KnownPlayers", () => {
  test("default state", () => {
    const EXPECTED_DEFAULT_STATE = Map({
      KnownPlayersIndex: Map(),
      KnownPlayersErrors: Map()
    });
    const test_store = createStore(KnownPlayers);
    const test_state = test_store.getState();
    expect(test_state).to.equal(EXPECTED_DEFAULT_STATE);
  });
});
