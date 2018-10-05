import { createSelector } from "reselect";

export const known_players_errors_path = [];

export function set_known_players_errors_path(path) {
  known_players_errors_path.splice(
    0,
    known_players_errors_path.length,
    ...path
  );
}

function state_selector(func) {
  return (state, ...rest) =>
    func(state.getIn(known_players_errors_path), ...rest);
}

export const getPlayersErrorsByUUID = state_selector(state => state);

export const getPlayersErrors = createSelector(
  [getPlayersErrorsByUUID],
  errors => errors.toSet()
);

export const getPlayersErrorsByType = createSelector(
  [getPlayersErrorsByUUID],
  errorsByUUID => errorsByUUID.groupBy(V => V.errorType)
);

export const getPlayersErrorsWithType = (state, type) => {
  return getPlayersErrorsByType.get(type);
};

export const getErrorWithUUID = (state, UUID) => {
  return getPlayersErrorsByUUID.get(UUID);
};
