import { is, Set } from "immutable";
import * as CURRENT_PLAYERS_ACTIONS from "../constants";

const initialState = Set();

const ADD_CURRENT_PLAYER = CURRENT_PLAYERS_ACTIONS.ADD_CURRENT_PLAYER;
const REMOVE_CURRENT_PLAYER = CURRENT_PLAYERS_ACTIONS.REMOVE_CURRENT_PLAYER;

function reduceAddCurrentPlayer(state, action) {
  if (is(action.type, ADD_CURRENT_PLAYER) && !action.error) {
    state = state.add(action.payload);
  }
  return state;
}

function reduceRemoveCurrentPlayer(state, action) {
  if (is(action.type, REMOVE_CURRENT_PLAYER) && !action.error) {
    state = state.delete(action.payload);
  }
  return state;
}

export function CurrentPlayersSet(state = initialState, action) {
  state = reduceAddCurrentPlayer(state, action);
  state = reduceRemoveCurrentPlayer(state, action);
  return state;
}

export default CurrentPlayersSet;
