import uuidv4 from "uuid/v4";
import { is, Set, List, Map } from "immutable";
import { combineReducers } from "redux-immutable";
import { createSelector } from "reselect";
import { Record } from "immutable";
import FSARecord from "../FSA/fsa-record";
import { CreateErrorEvent } from "../FSA/create-error-record";

// This file is a duck, as described here:  https://github.com/erikras/ducks-modular-redux

const KNOWN_PLAYERS_REDUCER_NAME = "KnownPlayers";
const KNOWN_PLAYERS_INDEX_REDUCER_NAME = "KnownPlayersIndex";
const KNOWN_PLAYERS_ERROR_REDUCER_NAME = "KnownPlayersErrors";

// Action constants
const ADD_KNOWN_PLAYER = "muster/known_players/ADD_KNOWN_PLAYER";
const REMOVE_KNOWN_PLAYER = "muster/known_players/REMOVE_KNOWN_PLAYER";
const UPDATE_KNOWN_PLAYER = "muster/known_players/UPDATE_KNOWN_PLAYER";
const CLEAR_KNOWN_PLAYERS_ERROR =
  "muster/known_players/CLEAR_KNOWN_PLAYERS_ERROR";

export const ACTION_TYPES = {
  ADD_KNOWN_PLAYER,
  REMOVE_KNOWN_PLAYER,
  UPDATE_KNOWN_PLAYER,
  CLEAR_KNOWN_PLAYERS_ERROR
};

// Action creators
export function AddKnownPlayer_pure(
  state,
  { name, DCINumber, UUID = undefined }
) {
  const new_player_record = new PlayerRecord({
    name,
    DCINumber,
    UUID: UUID || uuidv4()
  });
  if (!is(getPlayersWithDCINumber(state, DCINumber), undefined)) {
    return CreateErrorEvent({
      type: ADD_KNOWN_PLAYER,
      UUID: uuidv4(),
      time: Date(),
      errorType: "Duplicate DCI Number",
      message: "A player with the provided DCI number already exists.",
      data: Set([new_player_record, getPlayersWithDCINumber(state, DCINumber)])
    });
  }
  if (!is(getPlayerWithUUID(state, UUID), undefined)) {
    return CreateErrorEvent({
      type: ADD_KNOWN_PLAYER,
      UUID: uuidv4(),
      time: Date(),
      errorType: "Duplicate UUID",
      message: "A player record with the generated UUID already exists.",
      data: Set([new_player_record, getPlayerWithUUID(state, UUID)])
    });
  }
  const new_player_event = new FSARecord({
    type: ADD_KNOWN_PLAYER,
    payload: new_player_record
  });
  return new_player_event;
}
export function RemoveKnownPlayer_pure(state, UUID) {
  const remove_player_event = new FSARecord({
    type: REMOVE_KNOWN_PLAYER,
    payload: UUID
  });
  return remove_player_event;
}
export function UpdateKnownPlayer_pure(state, { name, DCINumber, UUID }) {
  if (is(getPlayerWithUUID(state, UUID), undefined)) {
    return CreateErrorEvent({
      type: UPDATE_KNOWN_PLAYER,
      UUID: uuidv4(),
      time: Date(),
      errorType: "No Such Player",
      message: "No such player exists",
      data: UUID
    });
  } else if (!is(getPlayersWithDCINumber(state, DCINumber), undefined)) {
    if (
      getPlayersWithDCINumber(state, DCINumber).some(v => !is(v.UUID, UUID))
    ) {
      // A player with the target DCINumber already exists.
      return CreateErrorEvent({
        type: UPDATE_KNOWN_PLAYER,
        UUID: uuidv4(),
        time: Date(),
        errorType: "Target DCINumber already in use",
        message: "Multiple players cannot share the same DCINumber.",
        data: DCINumber
      });
    }
  }
  const updated_player_record = new PlayerRecord({
    name: name,
    DCINumber: DCINumber,
    UUID: UUID
  });
  const updated_player_event = new FSARecord({
    type: UPDATE_KNOWN_PLAYER,
    payload: updated_player_record
  });
  return updated_player_event;
}
export function ClearKnownPlayersError_pure(state, UUID) {
  const clear_error_event = new FSARecord({
    type: CLEAR_KNOWN_PLAYERS_ERROR,
    payload: UUID
  });
  return clear_error_event;
}

// Selectors

// Known players index selectors

const INDEX_PATH = List.of(
  KNOWN_PLAYERS_REDUCER_NAME,
  KNOWN_PLAYERS_INDEX_REDUCER_NAME
);

export const getPlayersByUUID = state => {
  console.log("State inside getPlayersByID", state);
  return state.getIn(INDEX_PATH);
};

export const getPlayers = createSelector(
  [getPlayersByUUID],
  players => players.toSet()
);

export const getPlayersByName = createSelector(
  [getPlayersByUUID],
  playersByUUID => playersByUUID.groupBy(V => V.name)
);

export const getPlayersByDCINumber = createSelector(
  [getPlayersByUUID],
  playersByUUID => playersByUUID.groupBy(V => V.DCINumber)
);

export const getPlayersWithName = (state, name) => {
  return getPlayersByName(state).get(name);
};

export const getPlayersWithDCINumber = (state, DCINumber) => {
  return getPlayersByDCINumber(state).get(DCINumber);
};

export const getPlayerWithUUID = (state, UUID) => {
  return getPlayersByUUID(state).get(UUID);
};

// Known players errors selectors

const ERROR_PATH = List.of(
  KNOWN_PLAYERS_REDUCER_NAME,
  KNOWN_PLAYERS_ERROR_REDUCER_NAME
);

export const getPlayersErrorsByUUID = state => state.getIn(ERROR_PATH);

export const getPlayersErrors = createSelector(
  [getPlayersErrorsByUUID],
  errors => errors.toSet()
);

export const getPlayersErrorsByType = createSelector(
  [getPlayersErrorsByUUID],
  errorsByUUID => errorsByUUID.groupBy(V => V.errorType)
);

export const getPlayersErrorsWithType = (state, type) => {
  return getPlayersErrorsByType.get(type);
};

export const getErrorWithUUID = (state, UUID) => {
  return getPlayersErrorsByUUID.get(UUID);
};

// Record types

export const PlayerRecord = Record(
  {
    name: null,
    DCINumber: null,
    UUID: null
  },
  "PlayerRecord"
);

// Reducers

export const reducer = combineReducers({
  KnownPlayersIndex,
  KnownPlayersErrors
});

// Reduce known players index
const initialKnownPlayersState = Map();

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

function KnownPlayersIndex(state = initialKnownPlayersState, action) {
  state = reduceAddKnownPlayer(state, action);
  state = reduceUpdateKnownPlayer(state, action);
  state = reduceRemoveKnownPlayer(state, action);
  return state;
}

// Reduce known players errors
const initialKnownPlayerErrorsState = Map();

function reduceKnownPlayersEventError(state, action) {
  if (
    action.error &&
    Object.values(ACTION_TYPES).includes(action.type) &&
    action.type !== ACTION_TYPES.CLEAR_KNOWN_PLAYERS_ERROR
  ) {
    state = state.set(action.payload.UUID, action.payload);
  }
  return state;
}

function reduceClearKnownPlayersError(state, action) {
  if (is(action.type, ACTION_TYPES.CLEAR_KNOWN_PLAYERS_ERROR)) {
    state = state.delete(action.payload);
  }
  return state;
}

function KnownPlayersErrors(state = initialKnownPlayerErrorsState, action) {
  state = reduceKnownPlayersEventError(state, action);
  state = reduceClearKnownPlayersError(state, action);
  return state;
}

export default reducer;
