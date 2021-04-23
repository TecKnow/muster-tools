"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _playersSlice = _interopRequireWildcard(require("../playersSlice"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var initial_state = _playersSlice["default"].initial_state;
test("add and remove players", function () {
  /**
   * Demonstrate that players can be added and removed,
   * and that the Ids array remains sorted throughout.
   */
  var add_alice_state = (0, _playersSlice["default"])(initial_state, (0, _playersSlice.addPlayer)("Alice"));
  expect(add_alice_state).toEqual({
    ids: ["Alice"],
    entities: {
      Alice: {
        id: "Alice"
      }
    }
  });
  var add_charlie_state = (0, _playersSlice["default"])(add_alice_state, (0, _playersSlice.addPlayer)("Charlie"));
  expect(add_charlie_state).toEqual({
    ids: ["Alice", "Charlie"],
    entities: {
      Alice: {
        id: "Alice"
      },
      Charlie: {
        id: "Charlie"
      }
    }
  });
  var add_bob_state = (0, _playersSlice["default"])(add_charlie_state, (0, _playersSlice.addPlayer)("Bob"));
  expect(add_bob_state).toEqual({
    ids: ["Alice", "Bob", "Charlie"],
    entities: {
      Alice: {
        id: "Alice"
      },
      Charlie: {
        id: "Charlie"
      },
      Bob: {
        id: "Bob"
      }
    }
  });
  var remove_alice_state = (0, _playersSlice["default"])(add_bob_state, (0, _playersSlice.removePlayer)("Alice"));
  expect(remove_alice_state).toEqual({
    ids: ["Bob", "Charlie"],
    entities: {
      Charlie: {
        id: "Charlie"
      },
      Bob: {
        id: "Bob"
      }
    }
  });
}); // TODO: #8 Add tests to show that player names must be unique.