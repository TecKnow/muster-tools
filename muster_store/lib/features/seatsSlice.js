"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.selectPlayerSeat = exports.selectTableSeats = exports.selectSeatIds = exports.selectSeatById = exports.selectAllSeats = exports._set_reducer_path_fetch = exports._default_reducer_path_fetch = exports.resetSeats = exports.assignSeat = exports.shuffleZeroThunk = exports.seatsSlice = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _playersSlice = require("./playersSlice");

var _tablesSlice = require("./tablesSlice");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var seatsAdapter = (0, _toolkit.createEntityAdapter)();

var update_table = function update_table(table) {
  var tableId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var starting_index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  /**
   * Update the position values of seat objects to match their positions
   * in the passed in list.
   *
   * TableId must be provided if players may be
   * moving between tables.  Otherwise, it takes the value of the first
   * seat assignment in the list.
   */
  if (typeof tableId == "undefined") {
    tableId = table[0].table;
  }

  var _iterator = _createForOfIteratorHelper(table.entries()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          index = _step$value[0],
          item = _step$value[1];

      item.table = tableId;
      item.position = index + starting_index;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return table;
};

var find_table = function find_table(seat_entities, tableId) {
  return Object.values(seat_entities).filter(function (item) {
    return item.table == tableId;
  }).sort(seat_sort_comparer);
};

var find_player_seat = function find_player_seat(seat_entities, playerId) {
  return seat_entities[playerId];
};

var seat_sort_comparer = function seat_sort_comparer(a, b) {
  return a.table == b.table ? a.position - b.position : a.table - b.table;
}; // TODO: #10 Add shuffle action


var seatsSlice = (0, _toolkit.createSlice)({
  name: "seats",
  initialState: seatsAdapter.getInitialState(),
  reducers: {
    assignSeat: {
      reducer: function reducer(state, action) {
        /** The key to this method is converting from an unordered list of
         * triples (player, table, position) to ordered sublists and back,
         * very carefully.
         * */
        // The action tells us where the user should end up assigned
        var _action$payload = action.payload,
            player = _action$payload.id,
            destination_table = _action$payload.table,
            destination_position = _action$payload.position; // Find where the player is currently assigned

        var _find_player_seat = find_player_seat(state.entities, player),
            source_table = _find_player_seat.table,
            source_position = _find_player_seat.position; // Select all assignments at the source table into a sorted array


        var source_table_list = find_table(state.entities, source_table); // Pop the player who is going to move.
        // This removes them from the list, but not the entities object.
        // It is vital to set their table to null here
        // so the entities objects reflects that they have been poppped

        var _source_table_list$sp = source_table_list.splice(source_position, 1),
            _source_table_list$sp2 = _slicedToArray(_source_table_list$sp, 1),
            removed = _source_table_list$sp2[0];

        removed.table = null;
        removed.position = null; // console.log("Removed item", JSON.stringify(removed));

        update_table(source_table_list, source_table); // console.log("updated source table", JSON.stringify(source_table_list));
        // Select all assignments at the destination table into a sorted array

        var destination_table_list = find_table(state.entities, destination_table); // console.log("Original destination table list", JSON.stringify(destination_table_list));
        // Manipulate the ordered lists using slice mechanisms as normal

        destination_table_list.splice(destination_position, 0, removed); // console.log("updated destination table list", JSON.stringify(destination_table_list));
        // Update the seat assignments at each table to match their array index.

        update_table(destination_table_list, destination_table); // console.log("Normalized destination list", JSON.stringify(destination_table_list));
      },
      prepare: function prepare(player, table, position) {
        return {
          payload: {
            id: player,
            table: table,
            position: position
          }
        };
      }
    },
    resetSeats: function resetSeats(state) {
      update_table(_toConsumableArray(Object.values(state.entities)).sort(seat_sort_comparer), 0);
    }
  },
  extraReducers: function extraReducers(builder) {
    builder.addCase(_playersSlice.addPlayer, function (state, action) {
      var id = action.payload.id;
      var table = 0;
      var position = state.ids.length;
      seatsAdapter.addOne(state, {
        id: id,
        table: table,
        position: position
      });
    });
    builder.addCase(_playersSlice.removePlayer, function (state, action) {
      var id = action.payload;
      var player_table_id = find_player_seat(state.entities, id).table;
      seatsAdapter.removeOne(state, id); //console.log("Inital table:", JSON.stringify(player_table));

      update_table(find_table(state.entities, player_table_id)); // console.log("final table", JSON.stringify(updated_player_table));
      //seatsAdapter.updateMany(updated_player_table);
    }); // This seems to be the one case where no action is required.
    // builder.addCase([createTable], (state, action) => {});

    builder.addCase(_tablesSlice.removeTable, function (state, action) {
      var table_id = action.payload;

      if (table_id == 0) {
        return state;
      } //Filter and sort the assignments at the removed table.


      var table_members = find_table(state.entities, table_id); // find how many people are already seated at the deck of
      // unassigned players, table 0.

      var starting_position = Object.values(state.entities).reduce(function (accumulator, currentItem) {
        return accumulator + (currentItem.table == 0 ? 1 : 0);
      }, 0); // update the players from the removed table as though
      // they were being appended to table 0.

      update_table(table_members, 0, starting_position);
    });
    builder.addCase("seats/shuffleZero", function (state, action) {
      var new_positions = action.payload;
      var table_zero_list = find_table(state.entities, 0);
      table_zero_list.forEach(function (element, index) {
        element.position = new_positions[index];
      });
    });
  }
});
exports.seatsSlice = seatsSlice;

var shuffleZeroThunk = function shuffleZeroThunk() {
  return function (dispatch, getState) {
    var ACTION_TYPE = "seats/shuffleZero"; // Why are we creating an array of a range of integers?
    // To minimize the amount of work done in the action creator.

    var num_players_to_shuffle = selectTableSeats(getState(), 0).length;

    var positions_array = _toConsumableArray(Array(num_players_to_shuffle).keys()); // Knuth shuffle


    for (var i = positions_array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * i);
      var _ref = [positions_array[j], positions_array[i]];
      positions_array[i] = _ref[0];
      positions_array[j] = _ref[1];
    }

    return dispatch({
      type: ACTION_TYPE,
      payload: _toConsumableArray(positions_array)
    });
  };
};

exports.shuffleZeroThunk = shuffleZeroThunk;
var _seatsSlice$actions = seatsSlice.actions,
    assignSeat = _seatsSlice$actions.assignSeat,
    resetSeats = _seatsSlice$actions.resetSeats;
exports.resetSeats = resetSeats;
exports.assignSeat = assignSeat;

var _default_reducer_path_fetch = function _default_reducer_path_fetch(state) {
  return state.seats;
};

exports._default_reducer_path_fetch = _default_reducer_path_fetch;
var _reducer_path_fetch = _default_reducer_path_fetch;

var _set_reducer_path_fetch = function _set_reducer_path_fetch() {
  var fetch_function = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _default_reducer_path_fetch;
  _reducer_path_fetch = fetch_function;
};

exports._set_reducer_path_fetch = _set_reducer_path_fetch;

var _seatsAdapter$getSele = seatsAdapter.getSelectors(_reducer_path_fetch),
    selectAllSeats = _seatsAdapter$getSele.selectAll,
    selectSeatById = _seatsAdapter$getSele.selectById,
    selectSeatIds = _seatsAdapter$getSele.selectIds;

exports.selectSeatIds = selectSeatIds;
exports.selectSeatById = selectSeatById;
exports.selectAllSeats = selectAllSeats;

var selectTableSeats = function selectTableSeats(state, tableId) {
  var seats = Object.values(_reducer_path_fetch(state).entities);
  return Object.values(seats).filter(function (seat) {
    return seat.table == tableId;
  });
};

exports.selectTableSeats = selectTableSeats;

var selectPlayerSeat = function selectPlayerSeat(state, playerName) {
  return _reducer_path_fetch(state).entities[playerName];
};

exports.selectPlayerSeat = selectPlayerSeat;
var _default = seatsSlice.reducer;
exports["default"] = _default;