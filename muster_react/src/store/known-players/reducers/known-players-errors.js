import { is, Map } from "immutable";
import * as ACTIONS from "../constants";

const initialState = Map();

function reduceKnownPlayersEventError(state, action) {
  if (
    action.error &&
    action.type in ACTIONS &&
    action.type !== ACTIONS.CLEAR_KNOWN_PLAYERS_ERROR
  ) {
    state = state.set(action.payload.UUID, action.payload);
  }
  return state;
}

function reduceClearKnownPlayersError(state, action) {
  if (is(action.type, ACTIONS.CLEAR_KNOWN_PLAYERS_ERROR)) {
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
