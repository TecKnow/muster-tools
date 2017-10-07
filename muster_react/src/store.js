import { createActions, handleActions } from "redux-actions";
import { is, List, Map, Record } from "immutable";
import uuidv4 from "uuid/v4";

export const PlayerRecord = Record(
	{
		name: null,
		DCINumber: null,
		UUID: null
	},
	"PlayerRecord"
);

export const DuplicateUUIDErrorRecord = Record({
	errorType: "DuplicateUUIDErrorRecord",
	actionType: null,
	existingObject: null,
	newObject: null,
	// TODO:  Improve this message using string templates.
	message: "An object with this UUID already exists."
});

export function reduceDuplicateUUIDError(state, action) {
	if (state.hasIn(["KNOWN_PLAYER_INDEX", action.payload.UUID])) {
		const existingObject = state.getIn([
			"KNOWN_PLAYER_INDEX",
			action.payload.UUID
		]);
		const newObject = action.payload;
		const newErrorRecord = new DuplicateUUIDErrorRecord({
			actionType: action.type,
			existingObject: existingObject,
			newObject: newObject
		});
		state = logErrorRecord(state, newErrorRecord);
	}
	return state;
}

export const DuplicateDCIErrorRecord = Record({
	errorType: "DuplicateDCIErrorRecord",
	actionType: null,
	existingObject: null,
	newObject: null,
	// TODO:  Improve this message using string templates.
	message: "A player with this DCI number already exists."
});

export function reduceDuplicateDCIError(state, action) {
	if (
		state
			.getIn(["KNOWN_PLAYER_INDEX"])
			.some(V => is(V.DCINumber, action.payload.DCINumber))
	) {
		const filteredPlayers = state
			.getIn(["KNOWN_PLAYER_INDEX"])
			.filter(V => is(V.DCINumber, action.payload.DCINumber));
		const existingObject = filteredPlayers.first();
		const newObject = action.payload;
		const newErrorRecord = new DuplicateDCIErrorRecord({
			actionType: action.type,
			existingObject: existingObject,
			newObject: newObject
		});
		state = logErrorRecord(state, newErrorRecord);
	}
	return state;
}

export function logErrorRecord(state, errorRecord) {
	return state.updateIn(
		["KNOWN_PLAYER_ERRORS", errorRecord.errorType],
		(list = List()) => list.push(errorRecord)
	);
}

export const knownPlayersActionCreators = createActions({
	KNOWN_PLAYERS: {
		ADD(name, DCINumber, UUID = undefined) {
			return new PlayerRecord({
				name: name,
				DCINumber: DCINumber,
				UUID: UUID || uuidv4()
			});
		},
		UPDATE(name, DCINumber, UUID) {
			return new PlayerRecord({
				name: name,
				DCINumber: DCINumber,
				UUID: UUID
			});
		},
		REMOVE(UUID) {
			return UUID;
		},
		CLEAR_ERROR(errorRecord) {
			return errorRecord;
		}
	}
});

export const knownPlayersIndexReducers = handleActions(
	{
		KNOWN_PLAYERS: {
			ADD(state, action) {
				const initialState = state;
				state = reduceDuplicateDCIError(state, action);
				if (!state.equals(initialState)) {
					return state;
				}
				state = reduceDuplicateUUIDError(state, action);
				if (!state.equals(initialState)) {
					return state;
				}
				return state.setIn(
					["KNOWN_PLAYER_INDEX", action.payload.UUID],
					action.payload
				);
			},
			UPDATE(state, action) {}, // TODO: Implement when useful
			REMOVE(state, action) {}, // TODO: Implement when useful
			CLEAR_ERROR(state, action) {
				return state.updateIn(
					["KNOWN_PLAYER_ERRORS", action.payload.errorType],
					(list = List()) => list.filterNot(V => V.equals( action.payload))
				);
				// TODO: Delete error map keys with empty lists?
			}
		}
	},
	Map({
		KNOWN_PLAYER_INDEX: Map(),
		KNOWN_PLAYER_ERRORS: Map()
	})
);
