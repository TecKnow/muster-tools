import { KNOWN_PLAYERS_ACTIONS } from "../../known_players/actions";
import { CURRENT_PLAYERS_ACTIONS } from "../../current-players/actions";
import { MergeActions } from "../../action-merge";

export const PLAYERS_ACTIONS = MergeActions(
  KNOWN_PLAYERS_ACTIONS,
  CURRENT_PLAYERS_ACTIONS
);
