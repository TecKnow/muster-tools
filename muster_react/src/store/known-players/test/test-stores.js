import { Map } from "immutable";
import { PlayerRecordAlice, PlayerRecordBob } from "./test-players";

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
