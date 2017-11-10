import { is, Map, Set } from "immutable";
import {
  ADD_KNOWN_PLAYER,
  UPDATE_KNOWN_PLAYER,
  REMOVE_KNOWN_PLAYER
} from "../constants/known-players-index-actions";
import { CLEAR_KNOWN_PLAYERS_ERROR } from "../constants/known-players-errors-actions";

const initialState = Map();

const actionSet = Set([
  ADD_KNOWN_PLAYER,
  UPDATE_KNOWN_PLAYER,
  REMOVE_KNOWN_PLAYER
]);

function reduceKnownPlayersEventError(state, action) {
  if (actionSet.has(action.type) && action.error) {
    state = state.set(action.payload.UUID, action.payload);
  }
  return state;
}

function reduceClearKnownPlayersError(state, action) {
  if (is(action.type, CLEAR_KNOWN_PLAYERS_ERROR)) {
    state = state.delete(action.payload);
  }
  return state;
}

export function KnownPlayerErrors(state = initialState, action) {
  state = reduceKnownPlayersEventError(state, action);
  state = reduceClearKnownPlayersError(state, action);
  return state;
}

export default KnownPlayerErrors;
