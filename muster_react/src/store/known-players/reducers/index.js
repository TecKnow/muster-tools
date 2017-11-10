import { combineReducers } from "redux-immutable";
import KnownPlayersIndex from "./known-players-index";
import KnownPlayersErrors from "./known-players-errors";

export const KnownPlayers = combineReducers({
  KnownPlayersIndex,
  KnownPlayersErrors
});

export default KnownPlayers;
