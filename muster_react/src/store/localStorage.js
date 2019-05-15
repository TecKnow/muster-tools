import { is, fromJS, Set } from "immutable";
import { PlayerRecord } from "./ducks/known-players";
import { throttle } from "lodash";

// TODO: Move the save/restore code to the ducks that define the state.

const readState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    const deserializedState = fromJS(JSON.parse(serializedState));
    return deserializedState;
  } catch (err) {
    return undefined;
  }
};

const restoreCurrentPlayersSet = state => {
  if (is(state, undefined)) {
    return state;
  }
  const persisted_current_players_list = state.getIn([
    "CurrentPlayers",
    "CurrentPlayersSet"
  ]);
  const current_players_set = Set(persisted_current_players_list);
  const restoredState = state.setIn(
    ["CurrentPlayers", "CurrentPlayersSet"],
    current_players_set
  );
  return restoredState;
};

const restoreKnownPlayersRecords = state => {
  if (is(state, undefined)) {
    return state;
  }
  const persisted_known_players_map = state.getIn([
    "KnownPlayers",
    "KnownPlayersIndex"
  ]);
  const restored_known_players_map = persisted_known_players_map.map(v => {
    const player_record = new PlayerRecord(v);
    return player_record;
  });
  const restored_known_players_state = state.setIn(
    ["KnownPlayers", "KnownPlayersIndex"],
    restored_known_players_map
  );
  return restored_known_players_state;
};

export const loadState = () => {
  const persisted_state = readState();
  const restored_known_players_state = restoreKnownPlayersRecords(
    persisted_state
  );
  const restored_current_players_state = restoreCurrentPlayersSet(
    restored_known_players_state
  );
  return restored_current_players_state;
};

const pruneState = state => {
  if (is(state, undefined)) {
    return state;
  }
  return state.remove("form");
};

const writeState = state => {
  try {
    const serializedState = JSON.stringify(state.toJSON());
    localStorage.setItem("state", serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};

export const saveState = state => {
  const prunedState = pruneState(state);
  return writeState(prunedState);
};

export const UseLocalStorage = store => {
  store.subscribe(
    throttle(() => {
      saveState(store.getState().remove("form"));
    }, 1000)
  );
};
