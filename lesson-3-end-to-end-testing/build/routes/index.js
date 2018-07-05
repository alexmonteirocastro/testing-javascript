'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _recipes = require('./recipes');

var _recipes2 = _interopRequireDefault(_recipes);

var _frontend = require('./frontend');

var _frontend2 = _interopRequireDefault(_frontend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  userRoutes: _users2.default,
  recipesRoutes: _recipes2.default,
  frontendRouter: _frontend2.default
};