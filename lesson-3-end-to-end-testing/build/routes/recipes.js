'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _controllers = require('../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var recipesRoutes = new _express.Router();
var reviewsController = new _controllers2.default.ReviewsController();
var recipesController = new _controllers2.default.RecipesController();
var votesController = new _controllers2.default.VotesController();

recipesRoutes.get('/', recipesController.index);
recipesRoutes.get('/:id', _middleware2.default.hasRecipe, recipesController.find);
recipesRoutes.delete('/:id', _middleware2.default.auth, _middleware2.default.hasRecipe, _middleware2.default.authorize, recipesController.destroy);
recipesRoutes.post('/', _middleware2.default.auth, _middleware2.default.createRecipeValidator, recipesController.create);
recipesRoutes.put('/:id', _middleware2.default.auth, _middleware2.default.hasRecipe, _middleware2.default.authorize, _middleware2.default.updateRecipeValidator, recipesController.update);

recipesRoutes.get('/:id/voters', _middleware2.default.auth, _middleware2.default.hasRecipe, votesController.getVoters);
recipesRoutes.post('/:id/upvote', _middleware2.default.auth, _middleware2.default.hasRecipe, _middleware2.default.canUpvote, votesController.upvote);
recipesRoutes.get('/:id/reviews', _middleware2.default.hasRecipe, reviewsController.index);
recipesRoutes.post('/:id/downvote', _middleware2.default.auth, _middleware2.default.hasRecipe, _middleware2.default.canDownvote, votesController.downvote);
recipesRoutes.post('/:id/reviews', _middleware2.default.auth, _middleware2.default.hasRecipe, _middleware2.default.canReview, reviewsController.create);

exports.default = recipesRoutes;