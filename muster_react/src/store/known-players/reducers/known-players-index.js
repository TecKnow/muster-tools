import { is, Map } from "immutable";
import {
  ADD_KNOWN_PLAYER,
  UPDATE_KNOWN_PLAYER,
  REMOVE_KNOWN_PLAYER
} from "../constants/known-players-index-actions";

const initialState = Map();

function reduceSetKnownPlayer(state, action) {
  state.set(action.payload.UUID, action.payload);
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
    state = state.delete(action.payload.UUID);
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
