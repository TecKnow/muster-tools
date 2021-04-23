"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.selectPlayerIds = exports.selectPlayerById = exports.selectAllPlayers = exports.removePlayer = exports.addPlayer = exports.playersSlice = void 0;

var _toolkit = require("@reduxjs/toolkit");

var playersAdapter = (0, _toolkit.createEntityAdapter)({
  sortComparer: function sortComparer(a, b) {
    return a.id.localeCompare(b.id);
  }
});
var playersSlice = (0, _toolkit.createSlice)({
  name: "players",
  initialState: playersAdapter.getInitialState(),
  reducers: {
    addPlayer: {
      reducer: playersAdapter.addOne,
      prepare: function prepare(name) {
        return {
          payload: {
            id: name
          }
        };
      }
    },
    removePlayer: playersAdapter.removeOne
  }
});
exports.playersSlice = playersSlice;
var _playersSlice$actions = playersSlice.actions,
    addPlayer = _playersSlice$actions.addPlayer,
    removePlayer = _playersSlice$actions.removePlayer;
exports.removePlayer = removePlayer;
exports.addPlayer = addPlayer;

var _playersAdapter$getSe = playersAdapter.getSelectors(function (state) {
  return state.players;
}),
    selectAllPlayers = _playersAdapter$getSe.selectAll,
    selectPlayerById = _playersAdapter$getSe.selectById,
    selectPlayerIds = _playersAdapter$getSe.selectIds;

exports.selectPlayerIds = selectPlayerIds;
exports.selectPlayerById = selectPlayerById;
exports.selectAllPlayers = selectAllPlayers;
var _default = playersSlice.reducer;
exports["default"] = _default;