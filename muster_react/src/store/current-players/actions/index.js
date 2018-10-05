import { is } from "immutable";
import uuidv4 from "uuid/v4";
import FSARecord from "../../FSA/fsa-record";
import { CreateErrorEvent } from "../../FSA/create-error-record";
import { getPlayersByUUID } from "../../known-players/selectors";
import CURRENT_PLAYERS_ACTIONS from "../constants";
import { hasCurrentPlayer } from "../selectors";

export function AddCurrentPlayer_Pure(state, { UUID }) {
  if (is(getPlayersByUUID(state, UUID), undefined)) {
    return CreateErrorEvent({
      type: CURRENT_PLAYERS_ACTIONS.get("ADD_CURRENT_PLAYER"),
      UUID: uuidv4(),
      time: Date(),
      errorType: "No such player",
      message: "There is no player with the provided UUID",
      data: UUID
    });
  }
  if (hasCurrentPlayer(state, { UUID })) {
    return CreateErrorEvent({
      type: CURRENT_PLAYERS_ACTIONS.get("ADD_CURRENT_PLAYER"),
      UUID: uuidv4(),
      time: Date(),
      errorType: "Player already current",
      message: "That player is already currently playing",
      data: UUID
    });
  }
  const add_known_player_event = new FSARecord({
    type: CURRENT_PLAYERS_ACTIONS.get("ADD_CURRENT_PLAYER"),
    payload: UUID
  });
  return add_known_player_event;
}

export function RemoveCurrentPlayer(state, { UUID }) {
  if (is(getPlayersByUUID(state, UUID), undefined)) {
    return CreateErrorEvent({
      type: CURRENT_PLAYERS_ACTIONS.get("REMOVE_CURRENT_PLAYER"),
      UUID: uuidv4(),
      time: Date(),
      errorType: "No such player",
      message: "There is no player with the provided UUID",
      data: UUID
    });
  }
  if (!hasCurrentPlayer(state, { UUID })) {
    return CreateErrorEvent({
      type: CURRENT_PLAYERS_ACTIONS.get("REMOVE_CURRENT_PLAYER"),
      UUID: uuidv4(),
      time: Date(),
      errorType: "Player not current",
      message: "That player cannot be removed, they are not currently playing.",
      data: UUID
    });
  }
  const remove_current_player_event = new FSARecord({
    type: CURRENT_PLAYERS_ACTIONS.get("REMOVE_CURRENT_PLAYER"),
    payload: UUID
  });
  return remove_current_player_event;
}
