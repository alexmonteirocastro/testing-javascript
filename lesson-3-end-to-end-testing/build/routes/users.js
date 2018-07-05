'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _controllers = require('./../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRoutes = new _express.Router();
var authController = new _controllers2.default.AuthController();
var usersController = new _controllers2.default.UsersController();

userRoutes.get('/profile/:id', usersController.getUser);
userRoutes.put('/update', _middleware2.default.auth, usersController.updateProfile);
userRoutes.get('/:id/recipes', usersController.getRecipes);
userRoutes.get('/favorites', _middleware2.default.auth, usersController.getFavorites);
userRoutes.post('/signin', _middleware2.default.signinUserValidator, authController.signin);
userRoutes.post('/signup', _middleware2.default.registerUserValidator, authController.signup);
userRoutes.post('/:recipeId/favorites', _middleware2.default.auth, _middleware2.default.hasRecipe, _middleware2.default.canFavorite, usersController.favorite);

exports.default = userRoutes;