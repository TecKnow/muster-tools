import { is, List, Map, Record } from "immutable";
import { createSelector } from "reselect";
import uuidv4 from "uuid/v4";
import FSARecord from "../FSA/fsa-record";
import {
  ACTION_TYPES as CURRENT_PLAYERS_ACTIONS,
  REDUCER_NAMES as CURRENT_PLAYERS_REDUCERS
} from "./current-players";
import { getPlayersByUUID } from "./known-players";

// This file is a duck, as described here:  https://github.com/erikras/ducks-modular-redux

// Reducer names

const TABLES_REDUCER_NAME = "Tables";

// Action constants
const CREATE_TABLE = "muster/tables/CREATE_TABLE";
const DELETE_TABLE = "muster/tables/DELETE_TABLE";
const MOVE_PLAYER_TO_POSITION = "muster/tables/MOVE_PLAYER_TO_POSITION";
const RESET_TABLES = "muster/tables/RESET_TABLES";
const { ADD_CURRENT_PLAYER } = CURRENT_PLAYERS_ACTIONS;

export const ACTION_TYPES = {
  CREATE_TABLE,
  DELETE_TABLE,
  MOVE_PLAYER_TO_POSITION,
  RESET_TABLES
};

// Action creators
export const CreateTable_Pure = (state, { UUID }) => {
  const add_table_event = new FSARecord({
    type: CREATE_TABLE,
    payload: UUID !== undefined ? UUID : uuidv4()
  });
  return add_table_event;
};

export const DeleteTable_Pure = (state, { UUID }) => {
  const delete_table_event = new FSARecord({
    type: DELETE_TABLE,
    payload: UUID
  });
  return delete_table_event;
};

export const MovePlayerToPosition_Stateless = ({ player, table, position }) => {
  const move_player_to_position_event = new FSARecord({
    type: MOVE_PLAYER_TO_POSITION,
    payload: PlayerTableMoveRecord({ player, table, position })
  });
  return move_player_to_position_event;
};

export const MovePlayerToPosition_Pure = (
  state,
  { player, table, position }
) => {
  return MovePlayerToPosition_Stateless({ player, table, position });
};

// Thunks

export const MovePlayerToPosition = (player, table, position) => (
  dispatch,
  getState
) => {
  return dispatch(
    MovePlayerToPosition_Pure(getState(), { player, table, position })
  );
};

// Selectors

const TABLES_PATH = List.of(TABLES_REDUCER_NAME);

export const getAllTablesUUIDs = state => state.getIn(TABLES_PATH);
export const getTableUUIDs = (state, props) =>
  state.getIn(TABLES_PATH.push(props.tableUUID));

export const makeGetTablePlayerRecords = () => {
  return createSelector(
    [getTableUUIDs, getPlayersByUUID],
    (getTableUUIDs, getPlayersByUUID) =>
      getTableUUIDs.map(value => getPlayersByUUID.get(value))
  );
};

// Record types

const PlayerTableMoveRecord = Record({
  player: null,
  table: null,
  position: null
});

// Reducers

const initialTablesState = Map({ deck: List() });

const reduceAddCurrentPlayer = (state, action) => {
  // This is how new players get added to the deck when they sign in.
  // Since the order of players matters, the set of current players can't simply be reused

  if (is(action.type, ADD_CURRENT_PLAYER) && !action.error) {
    const old_deck = state.get("deck");
    const new_deck = old_deck.push(action.payload);
    const new_state = state.set("deck", new_deck);
    state = new_state;
  }
  return state;
};

const reduceCreateTable = (state, action) => {
  if (is(action.type, CREATE_TABLE) && !action.error) {
    const new_state = state.set(action.payload.UUID, List());
    state = new_state;
  }
  return state;
};

const removePlayerFromTableState = (state, player) => {
  // Find the player's existing location and remove them
  // First, find their current location(s)
  const current_locations_map = state.filter(table_list => {
    return table_list.contains(player);
  });
  const num_tables = current_locations_map.count();
  let max_num_occurances = 0;
  current_locations_map.forEach((table_list, table_id) => {
    const num_occurances = table_list.count(value => is(value, player));
    if (num_occurances > max_num_occurances) {
      max_num_occurances = num_occurances;
    }
    // Remove them from their existing locations.
    const new_list = table_list.filterNot(value => is(value, player));
    state = state.set(table_id, new_list);
  });
  return Map({ state, num_tables, max_num_occurances });
};

const reduceMovePlayerToPosition = (state, action) => {
  if (is(action.type, MOVE_PLAYER_TO_POSITION) && !action.error) {
    const { player, table, position } = action.payload;
    // Ensure that the destination table actually exists
    // and that the player has actually moved
    if (state.has(table) && !is(state.getIn([table, position]), player)) {
      const removal_results = removePlayerFromTableState(state, player);
      state = removal_results.get("state");
      const num_tables = removal_results.get("num_tables");
      const max_num_occurances = removal_results.get("max_num_occurances");
      if (!is(num_tables, 1) || !is(max_num_occurances, 1)) {
        if (num_tables > 1) {
          throw new Error("Found the same player at multiple tables");
        }
        if (max_num_occurances > 1) {
          throw new Error(
            "Found a the same player at a single table multiple times"
          );
        }
        throw new Error(
          "Found tables in an forbidden state wile trying move a player"
        );
      }
      // Put the player in their new position
      const old_list = state.get(table);
      const new_list = old_list.insert(position, player);
      state = state.set(table, new_list);
    }
  }
  return state;
};

export const reduceResetTables = (state, action) => {
  const {
    CURRENT_PLAYERS_REDUCER_NAME,
    CURRENT_PLAYERS_SET_REDUCER_NAME
  } = CURRENT_PLAYERS_REDUCERS;
  if (is(action.type, RESET_TABLES) && !action.error) {
    state = initialTablesState;
    state.setIn(
      [TABLES_REDUCER_NAME, "deck"],
      state
        .getIn([CURRENT_PLAYERS_REDUCER_NAME, CURRENT_PLAYERS_SET_REDUCER_NAME])
        .toList()
    );
  }
  return state;
};

const reduceTables = (state = initialTablesState, action) => {
  state = reduceAddCurrentPlayer(state, action);
  state = reduceCreateTable(state, action);
  state = reduceMovePlayerToPosition(state, action);
  return state;
};

export const reducer = reduceTables;
export default reducer;
