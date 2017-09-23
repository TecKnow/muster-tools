import { Map, Record } from "immutable";
import uuidv4 from "uuid/v4";
import { isFSA, isError } from "flux-standard-action";

// Manage known players

// Known player action types

export const ADD_KNOWN_PLAYER = "ADD_KNOWN_PLAYER";
export const UPDATE_KNOWN_PLAYER = "UPDATE_KNOWN_PLAYER";
export const REMOVE_KNOWN_PLAYER = "REMOVE_KNOWN_PLAYER";

// Known Player Record object

export const PlayerRecord = Record(
	{
		name: null,
		DCINumber: null,
		UUID: null
	},
	"PlayerRecord"
);

// Known Player Action Generators

export function createKnownPlayer(
	knownPlayers,
	name,
	DCINumber,
	UUID = undefined
) {
	// DCI Numbers must be unique
	if (knownPlayers.some(V => V.DCINumber === DCINumber)) {
		return {
			type: ADD_KNOWN_PLAYER,
			error: true,
			payload: new Error("A player with this DCI number already exists.")
		};
	}
	// TODO: Do I really want to handle this within a single function call?
	while (UUID === undefined || knownPlayers.has(UUID)) {
		UUID = uuidv4();
	}
	return {
		type: ADD_KNOWN_PLAYER,
		payload: new PlayerRecord({
			name: name,
			DCINumber: DCINumber,
			UUID: UUID
		})
	};
}
export function updateKnownPlayer() {}
export function removeKnownPlayer() {}

// Known player action reducer functions

export function reduceAddedPlayer(state, action) {
	if (
		isFSA(action) &&
		!isError(action) &&
		action.type === ADD_KNOWN_PLAYER &&
		!state.has(action.payload.UUID) &&
		!state.some(
			V =>
				V.DCINumber === action.payload.DCINumber ||
				V.DCINumber === action.payload.UUID
		)
	) {
		return state.set(action.payload.UUID, action.payload);
	}
	return state;
}

export function reduceUpdatedPlayer() {}
export function reduceRemovedPlayer() {}

// Known player central reducer

const initialState = Map();
export function reduceKnownPlayers(state = initialState, action) {
	switch (action.type) {
		case ADD_KNOWN_PLAYER:
			return reduceAddedPlayer(state, action);
		default:
			return state;
	}
}
