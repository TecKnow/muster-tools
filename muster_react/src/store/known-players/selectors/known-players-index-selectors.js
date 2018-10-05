import { createSelector } from "reselect";

export const known_players_index_path = [];

export function set_known_players_index_path(path) {
  known_players_index_path.splice(0, known_players_index_path.length, ...path);
}

function state_selector(func) {
  return (state, ...rest) =>
    func(state.getIn(known_players_index_path), ...rest);
}

export const getPlayersByUUID = state_selector(state => state);

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
