import {
  getPlayersByUUID as oldGetPlayersByUUID,
  getPlayers as oldGetPlayers,
  getPlayersByName as oldGetPlayersByName,
  getPlayersByDCINumber as oldGetPlayersByDCINumber,
  getPlayersWithName as oldGetPlayersWithName,
  getPlayersWithDCINumber as oldGetPlayersWithDCINumber,
  getPlayerWithUUID as oldGetPlayerWithUUID
} from "./known-players-index-selectors";
import {
  getPlayersErrorsByUUID as oldGetPlayersErrorsByUUID,
  getPlayersErrors as oldGetPlayersErrors,
  getPlayersErrorsByType as oldGetPlayersErrorsByType,
  getPlayersErrorsWithType as oldGetPlayersErrorsWithType,
  getErrorWithUUID as oldGetErrorWithUUID
} from "./known-players-errors-selectors";

export const getPlayersByUUID = state =>
  oldGetPlayersByUUID(state.get("KnownPlayersIndex"));
export const getPlayers = state =>
  oldGetPlayers(state.get("KnownPlayersIndex"));
export const getPlayersByName = state =>
  oldGetPlayersByName(state.get("KnownPlayersIndex"));
export const getPlayersByDCINumber = state =>
  oldGetPlayersByDCINumber(state.get("KnownPlayersIndex"));
export const getPlayersWithName = (state, name) =>
  oldGetPlayersWithName(state.get("KnownPlayersIndex"), name);
export const getPlayersWithDCINumber = (state, DCINumber) =>
  oldGetPlayersWithDCINumber(state.get("KnownPlayersIndex"), DCINumber);
export const getPlayerWithUUID = (state, UUID) =>
  oldGetPlayerWithUUID(state.get("KnownPlayersIndex"), UUID);
export const getPlayersErrorsByUUID = state =>
  oldGetPlayersErrorsByUUID(state.get("KnownPlayersErrors"));
export const getPlayersErrors = state =>
  oldGetPlayersErrors(state.get("KnownPlayersErrors"));
export const getPlayersErrorsByType = state =>
  oldGetPlayersErrorsByType(state.get("KnownPlayersErrors"));
export const getPlayersErrorsWithType = (state, type) =>
  oldGetPlayersErrorsWithType(state.get("KnownPlayersErrors"), type);
export const getErrorWithUUID = (state, UUID) =>
  oldGetErrorWithUUID(state.get("KnownPlayersErrors"), UUID);
