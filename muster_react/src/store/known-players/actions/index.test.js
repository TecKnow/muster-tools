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
  KnownPlayersTwo,
  ErrorsZero,
  ErrorsOne
} from "../test/test-stores";
import {
  PlayerRecordAlice,
  PlayerRecordBob,
  PlayerRecordBobDuplicateDCI,
  PlayerRecordBobDuplicateUUID,
  PlayerRecordBobDuplicateDCIUUID,
  PlayerRecordAliceUpdated
} from "../test/test-players";
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
import { testFSARecord } from "../../FSA/test-utils/test-FSA";
import { testErrorRecordFSA } from "../../FSA/test-utils/test-error-record";

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
          AddBobDuplicateDCIAction,
          AddBobDuplicateDCIAction.payload.delete("UUID")
        );
      });
      test("Create player with duplicate UUID", () => {
        const test_event = AddKnownPlayer_pure(
          KnownPlayersOne,
          PlayerRecordBobDuplicateUUID
        );
        testErrorRecordFSA(
          test_event,
          { type: actions.get("ADD_KNOWN_PLAYER", "ACTION_NOT_FOUND") },
          {
            errorType: "Duplicate UUID",
            data: Set([PlayerRecordBobDuplicateUUID, PlayerRecordAlice])
          }
        );
      });
      test("Create player with duplicate DCINumber and duplicate UUID", () => {
        const test_event = AddKnownPlayer_pure(
          KnownPlayersOne,
          PlayerRecordBobDuplicateDCIUUID
        );
        testErrorRecordFSA(
          test_event,
          { type: actions.get("ADD_KNOWN_PLAYER", "ACTION_NOT_FOUND") },
          {
            errorType: "Duplicate DCI Number",
            data: Set([
              PlayerRecordBobDuplicateDCIUUID,
              Map({ [PlayerRecordAlice.UUID]: PlayerRecordAlice })
            ])
          }
        );
      });
    });
    describe("RemoveKnownPlayer_pure", () => {
      test("Remove existing player", () => {
        const test_event = RemoveKnownPlayer_pure(
          KnownPlayersTwo,
          PlayerRecordBob.UUID
        );
        expect(test_event).to.be.equal(RemoveBobAction);
      });
      test("Remove last existing player", () => {
        const test_event = RemoveKnownPlayer_pure(
          KnownPlayersOne,
          PlayerRecordAlice.UUID
        );
        expect(test_event).to.be.equal(RemoveAliceAction);
      });
      test("Remove nonexistent player", () => {
        const test_event = RemoveKnownPlayer_pure(
          KnownPlayersOne,
          PlayerRecordBob.UUID
        );
        expect(test_event).to.be.equal(RemoveBobAction);
      });
    });
    describe("UpdateKnownPlayer_pure", () => {
      test("Update existing player", () => {
        const test_event = UpdateKnownPlayer_pure(KnownPlayersOne, {
          name: PlayerRecordAliceUpdated.name,
          DCINumber: PlayerRecordAliceUpdated.DCINumber,
          UUID: PlayerRecordAliceUpdated.UUID
        });
        expect(test_event).to.be.equal(UpdateAliceAction);
      });
      test("Update existing player to duplicate DCINumber", () => {
        const test_event = UpdateKnownPlayer_pure(KnownPlayersTwo, {
          name: PlayerRecordBobDuplicateDCI.name,
          DCINumber: PlayerRecordBobDuplicateDCI.DCINumber,
          UUID: PlayerRecordBobDuplicateDCI.UUID
        });
        testErrorRecordFSA(
          test_event,
          { type: UpdateBobDuplicateDCINumberAction.type },
          {
            errorType: UpdateBobDuplicateDCINumberAction.payload.errorType,
            data: UpdateBobDuplicateDCINumberAction.payload.data
          }
        );
      });
      test("Update nonexistent player", () => {
        const test_event = UpdateKnownPlayer_pure(
          KnownPlayersEmpty,
          PlayerRecordAliceUpdated
        );
        testErrorRecordFSA(
          test_event,
          { type: UpdateAliceNoSuchPlayerAction.type },
          {
            errorType: UpdateAliceNoSuchPlayerAction.errorType,
            data: UpdateAliceNoSuchPlayerAction.payload.data
          }
        );
      });
    });
    describe("ClearKnownPlayersError_pure", () => {
      test("Clear existing error", () => {
        const test_event = ClearKnownPlayersError_pure(
          ErrorsOne,
          "00000000-0000-0000-0000-000000000000"
        );
        testFSARecord(test_event, {
          type: actions.get("CLEAR_KNOWN_PLAYERS_ERROR"),
          error: false,
          payload: "00000000-0000-0000-0000-000000000000"
        });
      });
      test("Clear nonexistent error", () => {
        const test_event = ClearKnownPlayersError_pure(
          ErrorsZero,
          "00000000-0000-0000-0000-000000000000"
        );
        testFSARecord(test_event, {
          type: actions.get("CLEAR_KNOWN_PLAYERS_ERROR"),
          error: false,
          payload: "00000000-0000-0000-0000-000000000000"
        });
      });
    });
  });
});
