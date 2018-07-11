import { Map } from "immutable";
import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";
import KnownPlayers from "./index.js";
import {
  KnownPlayersEmpty,
  KnownPlayersOne,
  KnownPlayersTwo,
  KnownPlayersTwoUpdated,
  ErrorsZero,
  ErrorsOne
} from "../test/test-stores";
import {
  AddAliceAction,
  AddBobAction,
  AddBobDuplicateDCIAction,
  RemoveAliceAction,
  RemoveBobAction,
  UpdateAliceAction,
  UpdateBobDuplicateDCINumberAction,
  UpdateAliceNoSuchPlayerAction
} from "../test/test-actions";

chai.use(chaiImmutable);

describe("KnownPlayers", () => {
  test("default state", () => {
    const initial_state = undefined;
    const action = { type: "*INIT*" };
    const expected_state = KnownPlayersEmpty;
    const result = KnownPlayers(initial_state, action);
    expect(result).to.equal(expected_state);
  });
  describe("Add players", () => {
    test("add first player", () => {
      const initial_state = KnownPlayersEmpty;
      const action = AddAliceAction;
      const expected_state = KnownPlayersOne;
      const result = KnownPlayers(initial_state, action);
      expect(result).to.be.deep.equal(expected_state);
    });
    test("add second player", () => {
      const initial_state = KnownPlayersOne;
      const action = AddBobAction;
      const expected_state = KnownPlayersTwo;
      const result = KnownPlayers(initial_state, action);
      expect(result).to.be.deep.equal(expected_state);
    });
  });
  describe("Update players", () => {
    test("Update known player", () => {
      const initial_state = KnownPlayersTwo;
      const action = UpdateAliceAction;
      const expected_state = KnownPlayersTwoUpdated;
      const result = KnownPlayers(initial_state, action);
      expect(result).to.be.deep.equal(expected_state);
    });
  });
  describe("Remove players", () => {
    test("Remove known player", () => {
      const initial_state = KnownPlayersTwo;
      const action = RemoveBobAction;
      const result = KnownPlayers(initial_state, action);
      const expected_state = KnownPlayersOne;
      console.log("ERROR:", result);
      expect(result).to.be.deep.equal(expected_state);
    });
  });
  describe("Known Players Errors", {});
});
