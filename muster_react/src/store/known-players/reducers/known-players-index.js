import { is, Map } from "immutable";
import { KNOWN_PLAYERS_ACTIONS } from "../constants/";

const initialState = Map();

const ADD_KNOWN_PLAYER = KNOWN_PLAYERS_ACTIONS.get("ADD_KNOWN_PLAYER");
const UPDATE_KNOWN_PLAYER = KNOWN_PLAYERS_ACTIONS.get("UPDATE_KNOWN_PLAYER");
const REMOVE_KNOWN_PLAYER = KNOWN_PLAYERS_ACTIONS.get("REMOVE_KNOWN_PLAYER");

function reduceSetKnownPlayer(state, action) {
  state = state.set(action.payload.UUID, action.payload);
  return state;
}

function reduceAddKnownPlayer(state, action) {
  if (is(action.type, ADD_KNOWN_PLAYER) && !action.error) {
    state = reduceSetKnownPlayer(state, action);
  }
  return state;
}

function reduceUpdateKnownPlayer(state, action) {
  if (is(action.type, UPDATE_KNOWN_PLAYER) && !action.error) {
    state = reduceSetKnownPlayer(state, action);
  }
  return state;
}
function reduceRemoveKnownPlayer(state, action) {
  if (is(action.type, REMOVE_KNOWN_PLAYER) && !action.error) {
    state = state.delete(action.payload);
  }
  return state;
}

export function KnownPlayersIndex(state = initialState, action) {
  state = reduceAddKnownPlayer(state, action);
  state = reduceUpdateKnownPlayer(state, action);
  state = reduceRemoveKnownPlayer(state, action);
  return state;
}

export default KnownPlayersIndex;
