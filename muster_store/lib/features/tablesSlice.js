"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.selectTableIds = exports.selectTableById = exports.selectAllTables = exports.removeTable = exports.createTable = exports.tablesSlice = void 0;

var _toolkit = require("@reduxjs/toolkit");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var tablesAdapter = (0, _toolkit.createEntityAdapter)({
  sortComparer: function sortComparer(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }
});
var tablesSlice = (0, _toolkit.createSlice)({
  name: "tables",
  initialState: tablesAdapter.getInitialState({
    ids: [0],
    entities: {
      0: {
        id: 0
      }
    }
  }),
  reducers: {
    createTable: {
      reducer: function reducer(state, action) {
        var new_table_number = Math.max.apply(Math, _toConsumableArray(state.ids)) + 1;
        tablesAdapter.addOne(state, _objectSpread(_objectSpread({}, action), {}, {
          payload: {
            id: new_table_number
          }
        }));
      }
    },
    removeTable: {
      reducer: function reducer(state, action) {
        if (action.payload != 0) {
          tablesAdapter.removeOne(state, action);
        }
      },
      prepare: function prepare(tableId) {
        var action = {
          payload: tableId
        };

        if (tableId == 0) {
          action.error = true;
        }

        return action;
      }
    }
  }
});
exports.tablesSlice = tablesSlice;
var _tablesSlice$actions = tablesSlice.actions,
    createTable = _tablesSlice$actions.createTable,
    removeTable = _tablesSlice$actions.removeTable;
exports.removeTable = removeTable;
exports.createTable = createTable;

var _tablesAdapter$getSel = tablesAdapter.getSelectors(function (state) {
  return state.tables;
}),
    selectAllTables = _tablesAdapter$getSel.selectAll,
    selectTableById = _tablesAdapter$getSel.selectById,
    selectTableIds = _tablesAdapter$getSel.selectIds;

exports.selectTableIds = selectTableIds;
exports.selectTableById = selectTableById;
exports.selectAllTables = selectAllTables;
var _default = tablesSlice.reducer;
exports["default"] = _default;