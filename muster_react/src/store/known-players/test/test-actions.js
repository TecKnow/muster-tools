import FSARecord from "../FSA/fsa-record";
import actions from "../constants";
import {
	PlayerRecordAlice,
	PlayerRecordBob,
	PlayerRecordBobDuplicateDCI,
	PlayerRecordBobDuplicateUUID,
	PlayerRecordBobDuplicateDCIUUID
} from "./test-players";

export const AddAliceAction = new FSARecord({
	type: actions.get("ADD_KNOWN_PLAYER"),
	payload: PlayerRecordAlice
});
export const AddBobAction = new FSARecord({
	type: actions.get("ADD_KNOWN_PLAYER"),
	payload: PlayerRecordBob
});
export const AddBobDuplicateDCIAction = new FSARecord({
	type: actions.get("ADD_KNOWN_PLAYER"),
	payload: PlayerRecordBobDuplicateDCI
});
export const AddBobDuplicateUUIDAction = new FSARecord({
	type: actions.get("ADD_KNOWN_PLAYER"),
	payload: null
});
export const PlayerRecordBobDuplicateDCIUUIDAction = new FSARecord({
	type: actions.get("ADD_KNOWN_PLAYER"),
	payload: PlayerRecordBobDuplicateDCIUUID
});
