'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reviewsController = require('./reviewsController');

var _reviewsController2 = _interopRequireDefault(_reviewsController);

var _recipesController = require('./recipesController');

var _recipesController2 = _interopRequireDefault(_recipesController);

var _votesController = require('./votesController');

var _votesController2 = _interopRequireDefault(_votesController);

var _authController = require('./authController');

var _authController2 = _interopRequireDefault(_authController);

var _usersController = require('./usersController');

var _usersController2 = _interopRequireDefault(_usersController);

var _frontEndController = require('./frontEndController');

var _frontEndController2 = _interopRequireDefault(_frontEndController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  RecipesController: _recipesController2.default,
  ReviewsController: _reviewsController2.default,
  VotesController: _votesController2.default,
  UsersController: _usersController2.default,
  AuthController: _authController2.default,
  FrontEndController: _frontEndController2.default
};