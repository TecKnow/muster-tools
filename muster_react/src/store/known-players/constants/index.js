import { KNOWN_PLAYERS_INDEX_ACTIONS } from "./known-players-index-actions";
import { KNOWN_PLAYERS_ERRORS_ACTIONS } from "./known-players-errors-actions";
import { MergeActions } from './action-merge';

export const KNOWN_PLAYERS_ACTIONS = MergeActions(KNOWN_PLAYERS_INDEX_ACTIONS, KNOWN_PLAYERS_ERRORS_ACTIONS);

export default KNOWN_PLAYERS_ACTIONS;