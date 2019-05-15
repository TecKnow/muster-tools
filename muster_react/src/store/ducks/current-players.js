import { is, List, Map, Set } from "immutable";
import { combineReducers } from "redux-immutable";
import uuidv4 from "uuid/v4";
import FSARecord from "../FSA/fsa-record";
import { CreateErrorEvent } from "../FSA/create-error-record";
import {
  getPlayersByUUID,
  getPlayersWithDCINumber,
  AddKnownPlayer_pure
} from "./known-players";

// This file is a duck, as described here:  https://github.com/erikras/ducks-modular-redux

const CURRENT_PLAYERS_REDUCER_NAME = "CurrentPlayers";
const CURRENT_PLAYERS_SET_REDUCER_NAME = "CurrentPlayersSet";
const CURRENT_PLAYERS_ERROR_REDUCER_NAME = "CurrentPlayersErrors";

// Action Constants
const ADD_CURRENT_PLAYER = "muster/current_players/ADD_CURRENT_PLAYER";
const REMOVE_CURRENT_PLAYER = "muster/current_players/REMOVE_CURRENT_PLAYER";
const CLEAR_CURRENT_PLAYER_ERROR =
  "muster/current_players/CLEAR_CURRENT_PLAYER_ERROR";

export const ACTION_TYPES = {
  ADD_CURRENT_PLAYER,
  REMOVE_CURRENT_PLAYER,
  CLEAR_CURRENT_PLAYER_ERROR
};

//Action Creators
export function AddCurrentPlayer_Pure(state, { UUID }) {
  if (is(getPlayersByUUID(state, UUID), undefined)) {
    return CreateErrorEvent({
      type: ADD_CURRENT_PLAYER,
      UUID: uuidv4(),
      time: Date(),
      errorType: "No such player",
      message: "There is no player with the provided UUID",
      data: UUID
    });
  }
  if (hasCurrentPlayer(state, { UUID })) {
    return CreateErrorEvent({
      type: ADD_CURRENT_PLAYER,
      UUID: uuidv4(),
      time: Date(),
      errorType: "Player already current",
      message: "That player is already currently playing",
      data: UUID
    });
  }
  const add_known_player_event = new FSARecord({
    type: ADD_CURRENT_PLAYER,
    payload: UUID
  });
  return add_known_player_event;
}

export function RemoveCurrentPlayer(state, { UUID }) {
  if (is(getPlayersByUUID(state, UUID), undefined)) {
    return CreateErrorEvent({
      type: REMOVE_CURRENT_PLAYER,
      UUID: uuidv4(),
      time: Date(),
      errorType: "No such player",
      message: "There is no player with the provided UUID",
      data: UUID
    });
  }
  if (!hasCurrentPlayer(state, { UUID })) {
    return CreateErrorEvent({
      type: REMOVE_CURRENT_PLAYER,
      UUID: uuidv4(),
      time: Date(),
      errorType: "Player not current",
      message: "That player cannot be removed, they are not currently playing.",
      data: UUID
    });
  }
  const remove_current_player_event = new FSARecord({
    type: REMOVE_CURRENT_PLAYER,
    payload: UUID
  });
  return remove_current_player_event;
}

// Thunks
export const SignInPlayer = (playerName, DCINumber) => (dispatch, getState) => {
  const potentialPlayerMap = getPlayersWithDCINumber(getState(), DCINumber);
  let playerUUID;
  if (is(potentialPlayerMap, undefined) || potentialPlayerMap.isEmpty()) {
    // A new player, add them to the list of known players.
    const new_player_action = AddKnownPlayer_pure(getState(), {
      name: playerName,
      DCINumber
    });
    // TODO: What if this is an error?
    playerUUID = new_player_action.payload.UUID;
    dispatch(new_player_action);
  } else if (potentialPlayerMap.size > 1) {
    // Well this shouldn't happen!
    throw new Error("Multiple players found with the same DCI Number!");
  } else if (potentialPlayerMap.size === 1) {
    // A known player, just add them to the list of current players
    playerUUID = potentialPlayerMap.first().UUID;
  }
  return dispatch(AddCurrentPlayer_Pure(getState(), { UUID: playerUUID }));
};

// Selectors

// Current players set selectors
const SET_PATH = List.of(
  CURRENT_PLAYERS_REDUCER_NAME,
  CURRENT_PLAYERS_SET_REDUCER_NAME
);

export const getCurrentPlayerUUIDs = state => state.getIn(SET_PATH);

export function hasCurrentPlayer(state, { UUID }) {
  return getCurrentPlayerUUIDs(state).has(UUID);
}

// Current Players Errors Selectors
const ERROR_PATH = List.of(
  CURRENT_PLAYERS_REDUCER_NAME,
  CURRENT_PLAYERS_ERROR_REDUCER_NAME
);

export const getCurrentPlayerErrors = state => state.getIn(ERROR_PATH);

// Reducers

export const reducer = combineReducers({
  CurrentPlayersSet,
  CurrentPlayersErrors
});

// Current Players Set
const currentPlayersInitialState = Set();

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

export function CurrentPlayersSet(state = currentPlayersInitialState, action) {
  state = reduceAddCurrentPlayer(state, action);
  state = reduceRemoveCurrentPlayer(state, action);
  return state;
}

// Current Players Errors Reducer
const currentPlayersErrorsinitialState = Map();

const CLEAR_CURRENT_PLAYERS_ERROR = ACTION_TYPES.CLEAR_CURRENT_PLAYER_ERROR;

function reduceCurrentPlayersEventError(state, action) {
  if (action.error && Object.values(ACTION_TYPES).includes(action.type)) {
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

function CurrentPlayersErrors(
  state = currentPlayersErrorsinitialState,
  action
) {
  state = reduceCurrentPlayersEventError(state, action);
  state = reduceClearCurrentPlayersError(state, action);
  return state;
}

export default reducer;