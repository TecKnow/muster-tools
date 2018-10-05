import { combineReducers } from "redux-immutable";
import CurrentPlayersSet from "./current-players-set";
import CurrentPlayersErrors from "./current-players-errors";

export const KnownPlayers = combineReducers({
  CurrentPlayersSet,
  CurrentPlayersErrors
});

export default KnownPlayers;
