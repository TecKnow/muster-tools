import chai, { expect } from "chai";
import chaiImmutable from "chai-immutable";
import { Map, Set } from "immutable";
import { combineReducers } from "redux-immutable";
import {
  ACTION_TYPES as actions,
  AddKnownPlayer_pure,
  RemoveKnownPlayer_pure,
  UpdateKnownPlayer_pure,
  ClearKnownPlayersError_pure,
  getPlayers,
  getPlayersByName,
  getPlayersByUUID,
  getPlayersByDCINumber,
  getPlayersWithName,
  getPlayersWithDCINumber,
  getPlayerWithUUID,
  reducer
  // getPlayersErrorsByUUID,
  // getPlayersErrors,
  // getPlayersErrorsByType,
  // getPlayersErrorsWithType,
  // getErrorWithUUID
} from "./known-players";
import {
  KnownPlayersEmpty,
  KnownPlayersOne,
  KnownPlayersTwo,
  KnownPlayersTwoUpdated,
  ErrorsZero,
  ErrorsOne,
  ErrorsTwo,
  PlayerRecordAlice,
  PlayerRecordBob,
  PlayerRecordBobDuplicateDCI,
  PlayerRecordBobDuplicateUUID,
  PlayerRecordBobDuplicateDCIUUID,
  PlayerRecordAliceUpdated,
  AddAliceAction,
  AddBobAction,
  AddBobDuplicateDCIAction,
  RemoveAliceAction,
  RemoveBobAction,
  UpdateAliceAction,
  UpdateBobDuplicateDCINumberAction,
  UpdateAliceNoSuchPlayerAction,
  AddBobDuplicateDCIClear,
  UpdateBobDuplicateDCINumberActionClear
} from "./known-players-test-data";
import { testFSARecord } from "../FSA/test-utils/test-FSA";
import { testErrorRecordFSA } from "../FSA/test-utils/test-error-record";

chai.use(chaiImmutable);

describe("Imported actions", () => {
  /* Why is this here?
     I wanted to be sure that importing a package folder imports index.js
  */
  test("Contains merged events.", () => {
    expect(actions).to.deep.equal({
      ADD_KNOWN_PLAYER: "muster/known_players/ADD_KNOWN_PLAYER",
      REMOVE_KNOWN_PLAYER: "muster/known_players/REMOVE_KNOWN_PLAYER",
      UPDATE_KNOWN_PLAYER: "muster/known_players/UPDATE_KNOWN_PLAYER",
      CLEAR_KNOWN_PLAYERS_ERROR:
        "muster/known_players/CLEAR_KNOWN_PLAYERS_ERROR"
    });
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
          { type: actions.ADD_KNOWN_PLAYER },
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
          { type: actions.ADD_KNOWN_PLAYER },
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
          type: actions.CLEAR_KNOWN_PLAYERS_ERROR,
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
          type: actions.CLEAR_KNOWN_PLAYERS_ERROR,
          error: false,
          payload: "00000000-0000-0000-0000-000000000000"
        });
      });
    });
  });
});

// Constants tests
//TODO
test("Contains merged events.", () => {
  expect(actions).to.deep.equal({
    ADD_KNOWN_PLAYER: "muster/known_players/ADD_KNOWN_PLAYER",
    REMOVE_KNOWN_PLAYER: "muster/known_players/REMOVE_KNOWN_PLAYER",
    UPDATE_KNOWN_PLAYER: "muster/known_players/UPDATE_KNOWN_PLAYER",
    CLEAR_KNOWN_PLAYERS_ERROR: "muster/known_players/CLEAR_KNOWN_PLAYERS_ERROR"
  });
});

// Reducers tests

const KnownPlayers = combineReducers({
  KnownPlayers: reducer
});
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
      expect(result).to.be.deep.equal(expected_state);
    });
  });
  describe("Known Players Errors", () => {
    test("Add first error", () => {
      const initial_state = ErrorsZero;
      const action = AddBobDuplicateDCIAction;
      const result = KnownPlayers(initial_state, action);
      const expected_state = ErrorsOne;
      expect(result).to.be.deep.equal(expected_state);
    });
    test("Add second error", () => {
      const initial_state = ErrorsOne;
      const action = UpdateBobDuplicateDCINumberAction;
      const result = KnownPlayers(initial_state, action);
      const expected_state = ErrorsTwo;
      expect(result).to.be.deep.equal(expected_state);
    });
    test("Remove first error", () => {
      const initial_state = ErrorsOne;
      const action = AddBobDuplicateDCIClear;
      const result = KnownPlayers(initial_state, action);
      const expected_state = ErrorsZero;
      expect(result).to.be.deep.equal(expected_state);
    });
    test("Remove second error", () => {
      const initial_state = ErrorsTwo;
      const action = UpdateBobDuplicateDCINumberActionClear;
      const result = KnownPlayers(initial_state, action);
      const expected_state = ErrorsOne;
      expect(result).to.be.deep.equal(expected_state);
    });
  });
});

//Selectors tests

describe("known players index selectors", () => {
  const TEST_STORE_TWO = KnownPlayersTwo;
  const TEST_STORE_EMPTY = KnownPlayersEmpty;
  describe("getPlayers", () => {
    test("Two known players", () => {
      const TEST_VALUE = getPlayers(TEST_STORE_TWO);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_TWO.getIn(["KnownPlayers", "KnownPlayersIndex"]).toSet()
      );
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayers(TEST_STORE_EMPTY);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_EMPTY.getIn(["KnownPlayers", "KnownPlayersIndex"]).toSet()
      );
    });
  });
  describe("getPlayersByUUID", () => {
    test("Two known players", () => {
      const TEST_VALUE = getPlayersByUUID(TEST_STORE_TWO);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_TWO.getIn(["KnownPlayers", "KnownPlayersIndex"])
      );
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersByUUID(TEST_STORE_EMPTY);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_EMPTY.getIn(["KnownPlayers", "KnownPlayersIndex"])
      );
    });
  });
  describe("getPlayersByName", () => {
    test("Two known players", () => {
      const TEST_VALUE = getPlayersByName(TEST_STORE_TWO);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_TWO.getIn(["KnownPlayers", "KnownPlayersIndex"]).groupBy(
          V => V.name
        )
      );
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersByName(TEST_STORE_EMPTY);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_EMPTY.getIn(["KnownPlayers", "KnownPlayersIndex"]).groupBy(
          V => V.name
        )
      );
    });
  });
  describe("getPlayersByDCINumber", () => {
    test("Two known players", () => {
      const TEST_VALUE = getPlayersByDCINumber(TEST_STORE_TWO);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_TWO.getIn(["KnownPlayers", "KnownPlayersIndex"]).groupBy(
          V => V.DCINumber
        )
      );
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersByDCINumber(TEST_STORE_EMPTY);
      expect(TEST_VALUE).to.equal(
        TEST_STORE_EMPTY.getIn(["KnownPlayers", "KnownPlayersIndex"]).groupBy(
          V => V.DCINumber
        )
      );
    });
  });
  describe("GetPlayersWithName", () => {
    describe("Two known players", () => {
      test("Name found", () => {
        const TEST_VALUE = getPlayersWithName(
          TEST_STORE_TWO,
          PlayerRecordBob.name
        );
        expect(TEST_VALUE).to.equal(
          Map({ [PlayerRecordBob.UUID]: PlayerRecordBob })
        );
      });
      test("Name not found", () => {
        const TEST_VALUE = getPlayersWithName(TEST_STORE_TWO, "Malory");
        expect(TEST_VALUE).to.equal(undefined);
      });
      const TEST_VALUE = getPlayersWithName(TEST_STORE_TWO, "Malory");
      expect(TEST_VALUE).to.equal(undefined);
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersWithName(TEST_STORE_EMPTY, "Malory");
      expect(TEST_VALUE).to.equal(undefined);
    });
  });

  describe("getPlayerWithUUID", () => {
    describe("Two known players", () => {
      test("UUID found", () => {
        const TEST_VALUE = getPlayerWithUUID(
          TEST_STORE_TWO,
          PlayerRecordBob.UUID
        );
        expect(TEST_VALUE).to.equal(PlayerRecordBob);
      });
      test("UUID not found", () => {
        const TEST_VALUE = getPlayerWithUUID(
          TEST_STORE_TWO,
          "00000000-0000-0000-0000-999999999999"
        );
        expect(TEST_VALUE).to.equal(undefined);
      });
      const TEST_VALUE = getPlayerWithUUID(
        TEST_STORE_TWO,
        "00000000-0000-0000-0000-999999999999"
      );
      expect(TEST_VALUE).to.equal(undefined);
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayerWithUUID(
        TEST_STORE_EMPTY,
        "00000000-0000-0000-0000-999999999999"
      );
      expect(TEST_VALUE).to.equal(undefined);
    });
  });

  describe("getPlayersWithDCINumber", () => {
    describe("Two known players", () => {
      test("DCINumber found", () => {
        const TEST_VALUE = getPlayersWithDCINumber(
          TEST_STORE_TWO,
          PlayerRecordBob.DCINumber
        );
        expect(TEST_VALUE).to.equal(
          Map({ [PlayerRecordBob.UUID]: PlayerRecordBob })
        );
      });
      test("DCINumber not found", () => {
        const TEST_VALUE = getPlayersWithDCINumber(
          TEST_STORE_TWO,
          "9999999999"
        );
        expect(TEST_VALUE).to.equal(undefined);
      });
      const TEST_VALUE = getPlayersWithDCINumber(TEST_STORE_TWO, "9999999999");
      expect(TEST_VALUE).to.equal(undefined);
    });
    test("No known players", () => {
      const TEST_VALUE = getPlayersWithDCINumber(
        TEST_STORE_EMPTY,
        "9999999999"
      );
      expect(TEST_VALUE).to.equal(undefined);
    });
  });
});
