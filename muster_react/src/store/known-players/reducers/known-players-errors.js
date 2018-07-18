import { is, Map, Set } from "immutable";
import KNOWN_PLAYERS_INDEX_ACTIONS from "../constants/known-players-index-actions";
import KNOWN_PLAYERS_ERRORS_ACTIONS from "../constants/known-players-errors-actions";

const initialState = Map();

const actionSet = KNOWN_PLAYERS_INDEX_ACTIONS;
const CLEAR_KNOWN_PLAYERS_ERROR = KNOWN_PLAYERS_ERRORS_ACTIONS.get(
  "CLEAR_KNOWN_PLAYERS_ERROR"
);

function reduceKnownPlayersEventError(state, action) {
  if (action.error && actionSet.has(action.type)) {
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
