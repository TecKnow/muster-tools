import { is, Map, Set } from "immutable";
import CURRENT_PLAYERS_ACTIONS from "../constants";

const initialState = Map();

const actionSet = CURRENT_PLAYERS_ACTIONS;
const CLEAR_CURRENT_PLAYERS_ERROR = actionSet.get("CLEAR_CURRENT_PLAYER_ERROR");

function reduceCurrentPlayersEventError(state, action) {
  if (action.error && actionSet.has(action.type)) {
    state = state.set(action.payload.UUID, action.payload);
  }
  return state;
}

function reduceClearCurrentPlayersError(state, action) {
  if (is(action.type, CLEAR_CURRENT_PLAYERS_ERROR)) {
    state = state.delete(action.payload);
  }
  return state;
}

export function CurrentPlayersErrors(state = initialState, action) {
  state = reduceCurrentPlayersEventError(state, action);
  state = reduceClearCurrentPlayersError(state, action);
  return state;
}

export default CurrentPlayersErrors;
