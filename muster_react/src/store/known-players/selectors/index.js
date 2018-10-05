import { set_known_players_index_path } from "./known-players-index-selectors";
import { set_known_players_errors_path } from "./known-players-errors-selectors";

set_known_players_index_path(["KnownPlayersIndex"]);
set_known_players_errors_path(["KnownPlayersErrors"]);

export * from "./known-players-index-selectors";
export * from "./known-players-errors-selectors";
