import { Map } from "immutable";
import { PlayerRecordAlice, PlayerRecordBob } from "./test-players";
import { ErrorRecord } from "../FSA/error-record";

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

export const ErrorsZero = KnownPlayersTwo;

export const ErrorsOne = Map({
  KnownPlayersIndex: Map([
    [PlayerRecordAlice.UUID, PlayerRecordAlice],
    [PlayerRecordBob.UUID, PlayerRecordBob]
  ]),
  KnownPlayersErrors: Map([
    [
      "00000000-0000-0000-0000-000000000000",
      new ErrorRecord({
        UUID: "00000000-0000-0000-0000-000000000000",
        errorType: "TestError"
      })
    ]
  ])
});
