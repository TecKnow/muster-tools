import { createStore } from "redux";
import { Map, Record, Set } from "immutable";
import uuidv4 from "uuid/v4";

export const ADD_PLAYER = "ADD_PLAYER";
export const UPDATE_PLAYER = "UPDATE_PLAYER";
export const REMOVE_PLAYER = "REMOVE_PLAYER";

export const PlayerRecord = Record({
	name: null,
	DCI_Number: null,
	uuid: null
});

function handleAddPlayer(
	state,
	name,
	DCI_Number,
	playerUUID = null
) {
	while (playerUUID == null || state.has(playerUUID)) {
		playerUUID = uuidv4();
	}
	state.set(playerUUID, PlayerRecord(name, DCI_Number, playerUUID));
}

const initialState = Map();

function hanldePlayers(state = initialState, action) {
	let ret = state;
	switch (action.type) {
		case ADD_PLAYER:
			ret = handleAddPlayer(
				state,
				action.name,
				action.DCI_Number,
				action.uuid
			);
			break;
		case UPDATE_PLAYER:
			break;
		case REMOVE_PLAYER:
			break;
		default:
			break;
	}
	return ret;
}

let store = createStore(hanldePlayers());
