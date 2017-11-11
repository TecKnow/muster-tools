import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";
import { Map, Set } from "immutable";
import actions from "../constants";
import {
  AddKnownPlayer_pure,
  RemoveKnownPlayer_pure,
  UpdateKnownPlayer_pure,
  ClearKnownPlayersError_pure
} from "./index";
import {
  KnownPlayersEmpty,
  KnownPlayersOne,
  KnownPlayersTwo
} from "../test/test-stores";
import {
  PlayerRecordAlice,
  PlayerRecordBob,
  PlayerRecordBobDuplicateDCI,
  PlayerRecordBobDuplicateUUID,
  PlayerRecordBobDuplicateDCIUUID
} from "../test/test-players";
import {
  AddAliceAction,
  AddBobAction,
  AddBobDuplicateDCIAction,
  AddBobDuplicateUUIDAction,
  AddBobDuplicateDCIUUIDAction
} from "../test/test-actions";
import { testErrorRecordFSA } from "../FSA/test-utils/test-error-record";

chai.use(chaiImmutable);

describe("Imported actions", () => {
  /* Why is this here?
     I wanted to be sure that importing a package folder imports index.js
  */
  test("Contains merged events.", () => {
    expect(actions).to.equal(
      Map({
        ADD_KNOWN_PLAYER: "ADD_KNOWN_PLAYER",
        REMOVE_KNOWN_PLAYER: "REMOVE_KNOWN_PLAYER",
        UPDATE_KNOWN_PLAYER: "UPDATE_KNOWN_PLAYER",
        CLEAR_KNOWN_PLAYERS_ERROR: "CLEAR_KNOWN_PLAYERS_ERROR"
      })
    );
  });
});

describe("Test known players action creators", () => {
  describe("Pure action creators", () => {
    describe("AddKnownPlayer_pure", () => {
      test("Create first player", () => {
        const test_event = AddKnownPlayer_pure(
          KnownPlayersEmpty,
          PlayerRecordAlice
        );
        expect(test_event).to.equal(AddAliceAction);
      });
      test("Create second player", () => {
        const test_event = AddKnownPlayer_pure(
          KnownPlayersOne,
          PlayerRecordBob
        );
        expect(test_event).to.equal(AddBobAction);
      });
      test("Create player with duplicate DCINumber", () => {
        const test_event = AddKnownPlayer_pure(
          KnownPlayersOne,
          PlayerRecordBobDuplicateDCI
        );
        testErrorRecordFSA(
          test_event,
          { type: actions.get("ADD_KNOWN_PLAYER", "ACTION_NOT_FOUND") },
          {
            errorType: "Duplicate DCI Number",
            data: Set([
              PlayerRecordBobDuplicateDCI,
              Map({ [PlayerRecordAlice.UUID]: PlayerRecordAlice })
            ])
          }
        );
      });
      test("Create player with duplicate UUID", () => {});
      test("Create player with duplicate DCINumber and duplicate UUID", () => {});
    });
    describe("RemoveKnownPlayer_pure", () => {
      test("Remove existing player", () => {});
      test("Remove last existing player", () => {});
      test("Remove nonexistent player", () => {});
    });
    describe("UpdateKnownPlayer_pure", () => {
      test("Update existing player", () => {});
      test("Update nonexistent player", () => {});
    });
    describe("ClearKnownPlayersError_pure", () => {
      test("Clear existing error", () => {});
      test("Clear nonexistent error", () => {});
    });
  });
});
