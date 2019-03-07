import { Map, Set } from "immutable";
import FSARecord from "../FSA/fsa-record";
import ErrorRecord from "../FSA/error-record";
import { ACTION_TYPES as actions, PlayerRecord } from "./known-players";

// Players

// WARNING: Please note that the UUIDs used here are not valid UUIDs.
// They were selected to be easy to identify and differentiate in test logs
export const PlayerRecordAlice = new PlayerRecord({
  name: "Alice",
  DCINumber: "0000000000",
  UUID: "00000000-0000-0000-0000-000000000000"
});
export const PlayerRecordBob = new PlayerRecord({
  name: "Bob",
  DCINumber: "0000000001",
  UUID: "00000000-0000-0000-0000-000000000001"
});
export const PlayerRecordBobDuplicateDCI = new PlayerRecord({
  name: "Bob",
  DCINumber: "0000000000",
  UUID: "00000000-0000-0000-0000-000000000001"
});
export const PlayerRecordBobDuplicateUUID = new PlayerRecord({
  name: "Bob",
  DCINumber: "0000000001",
  UUID: "00000000-0000-0000-0000-000000000000"
});
export const PlayerRecordBobDuplicateDCIUUID = new PlayerRecord({
  name: "Bob",
  DCINumber: "0000000000",
  UUID: "00000000-0000-0000-0000-000000000000"
});
export const PlayerRecordAliceUpdated = new PlayerRecord({
  name: "Charlie",
  DCINumber: "0000000000",
  UUID: "00000000-0000-0000-0000-000000000000"
});

// Errors

//TODO:  Unify the data format between Add and Update errors.
export const AddBobDuplicateDCIErrorRecord = new ErrorRecord({
  errorType: "Duplicate DCI Number",
  UUID: "00000000-0000-0000-0001-000000000000",
  data: Set([
    PlayerRecordBobDuplicateDCI,
    Map({ [PlayerRecordAlice.UUID]: PlayerRecordAlice })
  ])
});
export const UpdateBobDuplicateDCINumberErrorRecord = new ErrorRecord({
  errorType: "Target DCINumber already in use",
  UUID: "00000000-0000-0000-0001-000000000001",
  data: PlayerRecordBobDuplicateDCI.DCINumber
});
export const UpdateAliceNoSuchPlayerErrorRecord = new ErrorRecord({
  errorType: "No Such Player",
  UUID: "00000000-0000-0000-0001-000000000001",
  data: PlayerRecordAliceUpdated.UUID
});

// Actions
export const AddAliceAction = new FSARecord({
  type: actions.ADD_KNOWN_PLAYER,
  payload: PlayerRecordAlice
});
export const AddBobAction = new FSARecord({
  type: actions.ADD_KNOWN_PLAYER,
  payload: PlayerRecordBob
});
export const AddBobDuplicateDCIAction = new FSARecord({
  type: actions.ADD_KNOWN_PLAYER,
  error: true,
  payload: AddBobDuplicateDCIErrorRecord
});

export const RemoveAliceAction = new FSARecord({
  type: actions.REMOVE_KNOWN_PLAYER,
  payload: PlayerRecordAlice.UUID
});

export const RemoveBobAction = new FSARecord({
  type: actions.REMOVE_KNOWN_PLAYER,
  payload: PlayerRecordBob.UUID
});

export const UpdateAliceAction = new FSARecord({
  type: actions.UPDATE_KNOWN_PLAYER,
  payload: PlayerRecordAliceUpdated
});

export const UpdateBobDuplicateDCINumberAction = new FSARecord({
  type: actions.UPDATE_KNOWN_PLAYER,
  error: true,
  payload: UpdateBobDuplicateDCINumberErrorRecord
});

export const UpdateAliceNoSuchPlayerAction = new FSARecord({
  type: actions.UPDATE_KNOWN_PLAYER,
  error: true,
  payload: UpdateAliceNoSuchPlayerErrorRecord
});

export const AddBobDuplicateDCIClear = new FSARecord({
  type: actions.CLEAR_KNOWN_PLAYERS_ERROR,
  payload: AddBobDuplicateDCIErrorRecord.UUID
});

export const UpdateBobDuplicateDCINumberActionClear = new FSARecord({
  type: actions.CLEAR_KNOWN_PLAYERS_ERROR,
  payload: UpdateBobDuplicateDCINumberErrorRecord.UUID
});

/*  The error generating actions below aren't actually valid.
    The architecture chosen means that the action creators won't create them.

    Perhaps they should be created so a clearer chain from the intended action
    can be shown. But this would mean that the store would need to be made
    smarter to reject these events, and listeners would need to be created to
    generate the errors.
*/

// export const AddBobDuplicateDCIAction = new FSARecord({
//  type: actions.get("ADD_KNOWN_PLAYER"),
//  payload: PlayerRecordBobDuplicateDCI
// });
// export const AddBobDuplicateUUIDAction = new FSARecord({
//  type: actions.get("ADD_KNOWN_PLAYER"),
//  payload: PlayerRecordBobDuplicateUUID
// });
// export const AddBobDuplicateDCIUUIDAction = new FSARecord({
//  type: actions.get("ADD_KNOWN_PLAYER"),
//  payload: PlayerRecordBobDuplicateDCIUUID
// });

// Stores
export const KnownPlayersEmpty = Map({
  KnownPlayers: Map({
    KnownPlayersIndex: Map(),
    KnownPlayersErrors: Map()
  })
});
export const KnownPlayersOne = Map({
  KnownPlayers: Map({
    KnownPlayersIndex: Map([[PlayerRecordAlice.UUID, PlayerRecordAlice]]),
    KnownPlayersErrors: Map()
  })
});
export const KnownPlayersTwo = Map({
  KnownPlayers: Map({
    KnownPlayersIndex: Map([
      [PlayerRecordAlice.UUID, PlayerRecordAlice],
      [PlayerRecordBob.UUID, PlayerRecordBob]
    ]),
    KnownPlayersErrors: Map()
  })
});
export const KnownPlayersTwoUpdated = Map({
  KnownPlayers: Map({
    KnownPlayersIndex: Map([
      [PlayerRecordAlice.UUID, PlayerRecordAliceUpdated],
      [PlayerRecordBob.UUID, PlayerRecordBob]
    ]),
    KnownPlayersErrors: Map()
  })
});

export const ErrorsZero = KnownPlayersTwo;

export const ErrorsOne = ErrorsZero.setIn(
  ["KnownPlayers", "KnownPlayersErrors", AddBobDuplicateDCIErrorRecord.UUID],
  AddBobDuplicateDCIErrorRecord
);

export const ErrorsTwo = ErrorsOne.setIn(
  [
    "KnownPlayers",
    "KnownPlayersErrors",
    UpdateBobDuplicateDCINumberErrorRecord.UUID
  ],
  UpdateBobDuplicateDCINumberErrorRecord
);

export const ErrorsThree = ErrorsTwo.setIn(
  [
    "KnownPlayers",
    "KnownPlayersErrors",
    UpdateAliceNoSuchPlayerErrorRecord.UUID
  ],
  UpdateAliceNoSuchPlayerErrorRecord
);
