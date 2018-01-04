import uuidv4 from "uuid/v4";
import { is, Set } from "immutable";
import FSARecord from "../FSA/fsa-record";
import PlayerRecord from "../player-record";
import ErrorRecord from "../FSA/error-record";
import KNOWN_PLAYERS_ACTIONS from "../constants";
import { getPlayerWithUUID, getPlayersWithDCINumber } from "../selectors";

function CreateKnownPlayerError_pure(
  state,
  { errorType, message, data, UUID = undefined, time = undefined }
) {
  // TODO:  Add handling for duplicate UUIDs.
  const new_error_record = new ErrorRecord({
    UUID: UUID || uuidv4(),
    time: time || Date(),
    errorType,
    message,
    data
  });
  return new_error_record;
}

function AddKnownPlayerError_pure(
  state,
  { type, errorType, message, data, UUID = undefined, time = undefined }
) {
  const new_error_event = new FSARecord({
    type,
    error: true,
    payload: CreateKnownPlayerError_pure(state, {
      errorType,
      message,
      data,
      UUID,
      time
    })
  });
  return new_error_event;
}

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
    return AddKnownPlayerError_pure(state, {
      type: KNOWN_PLAYERS_ACTIONS.get("ADD_KNOWN_PLAYER"),
      UUID: uuidv4(),
      time: Date(),
      errorType: "Duplicate DCI Number",
      message: "A player with the provided DCI number already exists.",
      data: Set([new_player_record, getPlayersWithDCINumber(state, DCINumber)])
    });
  }
  if (!is(getPlayerWithUUID(state, UUID), undefined)) {
    return AddKnownPlayerError_pure(state, {
      type: KNOWN_PLAYERS_ACTIONS.get("ADD_KNOWN_PLAYER"),
      UUID: uuidv4(),
      time: Date(),
      errorType: "Duplicate UUID",
      message: "A player record with the generated UUID already exists.",
      data: Set([new_player_record, getPlayerWithUUID(state, UUID)])
    });
  }
  const new_player_event = new FSARecord({
    type: KNOWN_PLAYERS_ACTIONS.get("ADD_KNOWN_PLAYER"),
    payload: new_player_record
  });
  return new_player_event;
}
export function RemoveKnownPlayer_pure(state, UUID) {
  const remove_player_event = new FSARecord({
    type: KNOWN_PLAYERS_ACTIONS.get("REMOVE_KNOWN_PLAYER"),
    payload: UUID
  });
  return remove_player_event;
}
export function UpdateKnownPlayer_pure(state, { name, DCINumber, UUID }) {
  if (is(getPlayerWithUUID(state, UUID), undefined)) {
    return AddKnownPlayerError_pure(state, {
      type: KNOWN_PLAYERS_ACTIONS.get("UPDATE_KNOWN_PLAYER"),
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
      return AddKnownPlayerError_pure(state, {
        type: KNOWN_PLAYERS_ACTIONS.get("UPDATE_KNOWN_PLAYER"),
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
    type: KNOWN_PLAYERS_ACTIONS.get("UPDATE_KNOWN_PLAYER"),
    payload: updated_player_record
  });
  return updated_player_event;
}
export function ClearKnownPlayersError_pure(state, UUID) {
  const clear_error_event = new FSARecord({
    type: KNOWN_PLAYERS_ACTIONS.get("CLEAR_KNOWN_PLAYERS_ERROR"),
    payload: UUID
  });
  return clear_error_event;
}
