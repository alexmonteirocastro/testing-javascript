'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../database/models');

var _models2 = _interopRequireDefault(_models);

var _redisClient = require('../helpers/redis-client');

var _redisClient2 = _interopRequireDefault(_redisClient);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Controller for all `users` endpoints
 * @export
 * @class UsersController
 */
var UsersController = function () {
  function UsersController() {
    _classCallCheck(this, UsersController);
  }

  _createClass(UsersController, [{
    key: 'favorite',

    /**
     * Favorite a recipe
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {json} json
     * @memberof RecipesController
     */
    value: async function favorite(req, res) {
      var recipe = await (0, _helpers.updateRecipeAttributes)(req.currentRecipe);

      if (recipe.favoritersIds.findIndex(function (user) {
        return user === req.authUser.id;
      }) !== -1) {
        await _redisClient2.default.srem('user:' + req.authUser.id + ':favorites', recipe.id);
        await _redisClient2.default.srem('recipe:' + recipe.id + ':favorites', req.authUser.id);
      } else {
        await _redisClient2.default.sadd('user:' + req.authUser.id + ':favorites', recipe.id);
        await _redisClient2.default.sadd('recipe:' + recipe.id + ':favorites', req.authUser.id);
      }

      return res.sendSuccessResponse({ message: 'Recipe favorited.' });
    }

    /**
     * Get all the user favorite recipes
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {json} json
     * @memberof RecipesController
     */

  }, {
    key: 'getFavorites',
    value: async function getFavorites(req, res) {
      var favoritesIds = await _redisClient2.default.smembers('user:' + req.authUser.id + ':favorites');

      var favorites = await _models2.default.Recipe.findAll({
        where: {
          id: _defineProperty({}, _models2.default.Sequelize.Op.in, favoritesIds)
        },
        include: {
          model: _models2.default.User,
          attributes: { exclude: ['password'] }
        }
      });

      favorites.map(async function (favorite) {
        var updatedRecipe = await (0, _helpers.updateRecipeAttributes)(favorite);
        return updatedRecipe;
      });

      return res.sendSuccessResponse({ favorites: favorites });
    }
    /**
     * Find a user with user Id
     *
     * @param {any} req express request object
     * @param {any} res express response object
     * @returns {json} user
     * @memberof UsersController
     */

  }, {
    key: 'getUser',
    value: async function getUser(req, res) {
      var user = await _models2.default.User.findById(req.params.id);

      if (!user) {
        return res.sendFailureResponse({ message: 'User not found.' }, 404);
      }

      return res.sendSuccessResponse({ user: user });
    }
    /**
     * Update authenticated user profile
     *
     * @param {any} req express request object
     * @param {any} res express response object
     * @returns {json} user
     * @memberof UsersController
     */

  }, {
    key: 'updateProfile',
    value: async function updateProfile(req, res) {
      var user = await req.authUserObj.update(req.body);

      return res.sendSuccessResponse({ user: user });
    }
    /**
     * Get all the recipes for a user
     *
     * @param {obj} req express request object
     * @param {obj} res express response object
     * @returns {json} json[Recipe]
     * @memberof UsersController
     */

  }, {
    key: 'getRecipes',
    value: async function getRecipes(req, res) {
      try {
        var user = await _models2.default.User.findById(req.params.id);

        if (!user) {
          return res.sendFailureResponse({ message: 'User not found.' }, 404);
        }

        var recipes = await user.getRecipes({
          include: { model: _models2.default.User, attributes: { exclude: ['password'] } }
        });

        return res.sendSuccessResponse({ user: user, recipes: recipes });
      } catch (error) {
        return res.sendFailureResponse({ message: 'User not found.' }, 404);
      }
    }
  }]);

  return UsersController;
}();

exports.default = UsersController;