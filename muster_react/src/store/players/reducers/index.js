import { combineReducers } from "redux-immutable";
import KnownPlayers from "../../known-players/reducers";
import CurrentPlayers from "../../current-players/reducers";

export const Players = combineReducers({
  KnownPlayers,
  CurrentPlayers
});
