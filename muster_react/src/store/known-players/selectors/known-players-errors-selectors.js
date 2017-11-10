import { createSelector } from "reselect";

export const getPlayersErrorsByUUID = state => state;

export const getPlayersErrors = createSelector(
  [getPlayersErrorsByUUID],
  errors => errors.toSet()
);

export const getPlayersErrorsByType = createSelector(
  [getPlayersErrorsByUUID],
  errorsByUUID => errorsByUUID.groupBy(V => V.errorType)
);

export function getPlayersErrorsWithType(state, type) {
  return getPlayersErrorsByType.get(type);
}

export function getErrorWithUUID(state, UUID) {
  return getPlayersErrorsByUUID.get(UUID);
}
