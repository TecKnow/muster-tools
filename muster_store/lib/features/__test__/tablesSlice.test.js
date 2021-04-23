"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _tablesSlice = _interopRequireWildcard(require("../tablesSlice"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

test("Add and remove tables", function () {
  /**
   * Show that tables can be added and removed
   * and that the ids array remains sorted throughout.
   *
   * Show that holes from deleted tables don't get filled in.
   */
  var one_table_state = (0, _tablesSlice["default"])(undefined, (0, _tablesSlice.createTable)());
  var two_table_state = (0, _tablesSlice["default"])(one_table_state, (0, _tablesSlice.createTable)());
  var three_table_state = (0, _tablesSlice["default"])(two_table_state, (0, _tablesSlice.createTable)());
  expect(three_table_state).toEqual({
    entities: {
      0: {
        id: 0
      },
      1: {
        id: 1
      },
      2: {
        id: 2
      },
      3: {
        id: 3
      }
    },
    ids: [0, 1, 2, 3]
  });
  var remove_table_two_state = (0, _tablesSlice["default"])(three_table_state, (0, _tablesSlice.removeTable)(2));
  expect(remove_table_two_state).toEqual({
    entities: {
      0: {
        id: 0
      },
      1: {
        id: 1
      },
      3: {
        id: 3
      }
    },
    ids: [0, 1, 3]
  });
  var add_table_four_state = (0, _tablesSlice["default"])(remove_table_two_state, (0, _tablesSlice.createTable)()); // Adding tables does not fill gaps from removed tables.

  expect(add_table_four_state).toEqual({
    entities: {
      0: {
        id: 0
      },
      1: {
        id: 1
      },
      3: {
        id: 3
      },
      4: {
        id: 4
      }
    },
    ids: [0, 1, 3, 4]
  });
  var remove_table_four_state = (0, _tablesSlice["default"])(add_table_four_state, (0, _tablesSlice.removeTable)(4));
  expect(remove_table_four_state).toEqual(remove_table_two_state);
});
test("reducer won't delete table 0", function () {
  // type: "" is not, so far as I know, the actual initial action,
  // but it serves the same purpose.
  var initial_state = (0, _tablesSlice["default"])(undefined, {
    type: ""
  });
  var delete_zero_state = (0, _tablesSlice["default"])(initial_state, (0, _tablesSlice.removeTable)(0));
  expect(delete_zero_state).toEqual(initial_state);
});
test("removeTable action creator errors on deleting table 0", function () {
  var remove_zero_action = (0, _tablesSlice.removeTable)(0);
  expect(remove_zero_action).toHaveProperty("error", true);
});