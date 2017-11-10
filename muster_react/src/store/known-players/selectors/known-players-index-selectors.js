import { createSelector } from "reselect";

export const getPlayersByUUID = state => state;

export const getPlayers = createSelector([getPlayersByUUID], players =>
  players.toSet()
);

export const getPlayersByName = createSelector(
  [getPlayersByUUID],
  playersByUUID => playersByUUID.groupBy(V => V.name)
);

export const getPlayersByDCINumber = createSelector(
  [getPlayersByUUID],
  playersByUUID => playersByUUID.groupBy(V => V.DCINumber)
);

export const getPlayersWithName = (state, name) => {
  return getPlayersByName(state).get(name);
};

export const getPlayersWithDCINumber = (state, DCINumber) => {
  return getPlayersByDCINumber(state).get(DCINumber);
};

export const getPlayerWithUUID = (state, UUID) => {
  return getPlayersByUUID(state).get(UUID);
};
