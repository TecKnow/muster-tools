"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _seatsSlice = require("./features/seatsSlice");

Object.keys(_seatsSlice).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _seatsSlice[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _seatsSlice[key];
    }
  });
});

var _playersSlice = require("./features/playersSlice");

Object.keys(_playersSlice).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _playersSlice[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _playersSlice[key];
    }
  });
});

var _tablesSlice = require("./features/tablesSlice");

Object.keys(_tablesSlice).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tablesSlice[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _tablesSlice[key];
    }
  });
});