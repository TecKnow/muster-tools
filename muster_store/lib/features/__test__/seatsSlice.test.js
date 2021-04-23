"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _playersSlice = require("../playersSlice");

var _tablesSlice = require("../tablesSlice");

var _seatsSlice = _interopRequireWildcard(require("../seatsSlice"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

beforeEach(function () {
  (0, _seatsSlice._set_reducer_path_fetch)(function (state) {
    return state;
  });
});
afterEach(function () {
  (0, _seatsSlice._set_reducer_path_fetch)();
});
var initial_state = (0, _seatsSlice["default"])(undefined, "");
var four_player_starting_state = {
  ids: ["Alice", "Bob", "Charlie", "Dan"],
  entities: {
    Alice: {
      id: "Alice",
      table: 0,
      position: 0
    },
    Bob: {
      id: "Bob",
      table: 0,
      position: 1
    },
    Charlie: {
      id: "Charlie",
      table: 0,
      position: 2
    },
    Dan: {
      id: "Dan",
      table: 0,
      position: 3
    }
  }
};
var four_players_one_table_state = {
  ids: ["Alice", "Bob", "Charlie", "Dan"],
  entities: {
    Alice: {
      id: "Alice",
      table: 0,
      position: 0
    },
    Bob: {
      id: "Bob",
      table: 0,
      position: 1
    },
    Charlie: {
      id: "Charlie",
      table: 1,
      position: 1
    },
    Dan: {
      id: "Dan",
      table: 1,
      position: 0
    }
  }
};
test("Added players get seats at table 0", function () {
  var one_player_state = (0, _seatsSlice["default"])(initial_state, (0, _playersSlice.addPlayer)("Alice"));
  var two_player_state = (0, _seatsSlice["default"])(one_player_state, (0, _playersSlice.addPlayer)("Bob"));
  var three_player_state = (0, _seatsSlice["default"])(two_player_state, (0, _playersSlice.addPlayer)("Charlie"));
  var four_player_state = (0, _seatsSlice["default"])(three_player_state, (0, _playersSlice.addPlayer)("Dan"));
  expect(four_player_state).toEqual(four_player_starting_state);
});
test("Rearrange players in table 0", function () {
  var charlie_first_state = (0, _seatsSlice["default"])(four_player_starting_state, (0, _seatsSlice.assignSeat)("Charlie", 0, 0));
  expect(charlie_first_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: {
        id: "Alice",
        table: 0,
        position: 1
      },
      Bob: {
        id: "Bob",
        table: 0,
        position: 2
      },
      Charlie: {
        id: "Charlie",
        table: 0,
        position: 0
      },
      Dan: {
        id: "Dan",
        table: 0,
        position: 3
      }
    }
  });
});
test("move players from table 0 to another table", function () {
  // Players fall to the lowest open position when moved.
  var move_charlie_state = (0, _seatsSlice["default"])(four_player_starting_state, (0, _seatsSlice.assignSeat)("Charlie", 1, 3));
  expect(move_charlie_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: {
        id: "Alice",
        table: 0,
        position: 0
      },
      Bob: {
        id: "Bob",
        table: 0,
        position: 1
      },
      Charlie: {
        id: "Charlie",
        table: 1,
        position: 0
      },
      Dan: {
        id: "Dan",
        table: 0,
        position: 2
      }
    }
  });
  var move_dan_state = (0, _seatsSlice["default"])(move_charlie_state, (0, _seatsSlice.assignSeat)("Dan", 1, 0));
  expect(move_dan_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: {
        id: "Alice",
        table: 0,
        position: 0
      },
      Bob: {
        id: "Bob",
        table: 0,
        position: 1
      },
      Charlie: {
        id: "Charlie",
        table: 1,
        position: 1
      },
      Dan: {
        id: "Dan",
        table: 1,
        position: 0
      }
    }
  });
});
test("remove a player", function () {
  var remove_dan_state = (0, _seatsSlice["default"])(four_players_one_table_state, (0, _playersSlice.removePlayer)("Dan"));
  expect(remove_dan_state).toEqual({
    ids: ["Alice", "Bob", "Charlie"],
    entities: {
      Alice: {
        id: "Alice",
        table: 0,
        position: 0
      },
      Bob: {
        id: "Bob",
        table: 0,
        position: 1
      },
      Charlie: {
        id: "Charlie",
        table: 1,
        position: 0
      }
    }
  });
});
test("remove a table", function () {
  var remove_table_state = (0, _seatsSlice["default"])(four_players_one_table_state, (0, _tablesSlice.removeTable)(1));
  expect(remove_table_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: {
        id: "Alice",
        table: 0,
        position: 0
      },
      Bob: {
        id: "Bob",
        table: 0,
        position: 1
      },
      Charlie: {
        id: "Charlie",
        table: 0,
        position: 3
      },
      Dan: {
        id: "Dan",
        table: 0,
        position: 2
      }
    }
  });
});
test("remove table 0", function () {
  var remove_table_zero_state = (0, _seatsSlice["default"])(four_players_one_table_state, (0, _tablesSlice.removeTable)(0));
  expect(remove_table_zero_state).toEqual(four_players_one_table_state);
});
test("Shuffle action", function () {
  var mockDispatch = jest.fn().mockName("mockDispatch");
  var mockGetState = jest.fn().mockName("mockGetState").mockReturnValue(four_player_starting_state);
  (0, _seatsSlice.shuffleZeroThunk)()(mockDispatch, mockGetState);
  expect(mockGetState).toHaveBeenCalled();
  expect(mockDispatch).toHaveBeenCalled();
  var action = mockDispatch.mock.calls[0][0];
  expect(action).toHaveProperty("type", "seats/shuffleZero");
  expect(action).toHaveProperty("payload");
  var payload = action.payload;
  expect(payload).toHaveLength(4);
  expect(_toConsumableArray(payload).sort()).toEqual(_toConsumableArray(Array(4).keys()));
});
test("Shuffle Reducer", function () {
  var mockDispatch = jest.fn().mockName("mockDispatch");
  var mockGetState = jest.fn().mockName("mockGetState").mockReturnValue(four_player_starting_state);
  (0, _seatsSlice.shuffleZeroThunk)()(mockDispatch, mockGetState);
  expect(mockGetState).toHaveBeenCalled();
  expect(mockDispatch).toHaveBeenCalled();
  var action = mockDispatch.mock.calls[0][0];
  var payload = action.payload;
  var shuffled_state = (0, _seatsSlice["default"])(four_player_starting_state, action);
  var shuffled_entities = Object.values(shuffled_state.entities);
  shuffled_entities.forEach(function (value, index) {
    expect(value.position).toEqual(payload[index]);
  });
});
test("reset all seats", function () {
  var reset_state = (0, _seatsSlice["default"])(four_players_one_table_state, (0, _seatsSlice.resetSeats)());
  expect(reset_state).toEqual({
    ids: ["Alice", "Bob", "Charlie", "Dan"],
    entities: {
      Alice: {
        id: "Alice",
        table: 0,
        position: 0
      },
      Bob: {
        id: "Bob",
        table: 0,
        position: 1
      },
      Charlie: {
        id: "Charlie",
        table: 0,
        position: 3
      },
      Dan: {
        id: "Dan",
        table: 0,
        position: 2
      }
    }
  });
});
test("selectTableSeats", function () {
  expect((0, _seatsSlice.selectTableSeats)(four_player_starting_state, 0)).toEqual([{
    id: "Alice",
    position: 0,
    table: 0
  }, {
    id: "Bob",
    position: 1,
    table: 0
  }, {
    id: "Charlie",
    position: 2,
    table: 0
  }, {
    id: "Dan",
    position: 3,
    table: 0
  }]);
  expect((0, _seatsSlice.selectTableSeats)(four_players_one_table_state, 1)).toEqual([{
    id: "Charlie",
    position: 1,
    table: 1
  }, {
    id: "Dan",
    position: 0,
    table: 1
  }]);
});
test("selectPlayerSeat", function () {
  expect((0, _seatsSlice.selectPlayerSeat)(four_players_one_table_state, "Charlie")).toEqual({
    id: "Charlie",
    table: 1,
    position: 1
  });
  expect((0, _seatsSlice.selectPlayerSeat)(four_player_starting_state, "Alice")).toEqual({
    id: "Alice",
    table: 0,
    position: 0
  });
});