import { Map } from "immutable";
import {
  PlayerRecordAlice,
  PlayerRecordBob,
  PlayerRecordAliceUpdated
} from "./test-players";
import {
  AddBobDuplicateDCIErrorRecord,
  UpdateBobDuplicateDCINumberErrorRecord,
  UpdateAliceNoSuchPlayerErrorRecord
} from "./test-errors";

export const KnownPlayersEmpty = Map({
  KnownPlayersIndex: Map(),
  KnownPlayersErrors: Map()
});
export const KnownPlayersOne = Map({
  KnownPlayersIndex: Map([[PlayerRecordAlice.UUID, PlayerRecordAlice]]),
  KnownPlayersErrors: Map()
});
export const KnownPlayersTwo = Map({
  KnownPlayersIndex: Map([
    [PlayerRecordAlice.UUID, PlayerRecordAlice],
    [PlayerRecordBob.UUID, PlayerRecordBob]
  ]),
  KnownPlayersErrors: Map()
});
export const KnownPlayersTwoUpdated = Map({
  KnownPlayersIndex: Map([
    [PlayerRecordAlice.UUID, PlayerRecordAliceUpdated],
    [PlayerRecordBob.UUID, PlayerRecordBob]
  ]),
  KnownPlayersErrors: Map()
});

export const ErrorsZero = KnownPlayersTwo;

export const ErrorsOne = ErrorsZero.setIn(
  ["KnownPlayersErrors", AddBobDuplicateDCIErrorRecord.UUID],
  AddBobDuplicateDCIErrorRecord
);

export const ErrorsTwo = ErrorsOne.setIn(
  ["KnownPlayersErrors", UpdateBobDuplicateDCINumberErrorRecord.UUID],
  UpdateBobDuplicateDCINumberErrorRecord
);

export const ErrorsThree = ErrorsTwo.setIn(
  ["KnownPlayersErrors", UpdateAliceNoSuchPlayerErrorRecord.UUID],
  UpdateAliceNoSuchPlayerErrorRecord
);
