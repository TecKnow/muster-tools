//import { createSelector } from "reselect";

export const getCurrentPlayerUUIDs = state => state.get("CurrentPlayers");

export function hasCurrentPlayer(state, { UUID }) {
  return getCurrentPlayerUUIDs(state).has(UUID);
}
