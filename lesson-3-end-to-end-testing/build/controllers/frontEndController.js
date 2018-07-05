'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../database/models');

var _models2 = _interopRequireDefault(_models);

var _redisClient = require('../helpers/redis-client');

var _redisClient2 = _interopRequireDefault(_redisClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Controller to handle the personal requests of the frontend
 *
 * @export
 * @class FrontEndController
 */
var FrontEndController = function () {
  function FrontEndController() {
    _classCallCheck(this, FrontEndController);
  }

  _createClass(FrontEndController, [{
    key: 'home',

    /**
     * Return data needed by the home page
     *
     * @param {obj} req express request object
     * @param {obj} res express response object
     * @returns {json} json
     * @memberof FrontEndController
     */
    value: async function home(req, res) {
      // Get the most favorited recipes begin
      var recipeFavoritesIds = await _redisClient2.default.keys('recipe:*:favorites');

      _redisClient2.default.multi();
      recipeFavoritesIds.forEach(function (id) {
        return _redisClient2.default.smembers(id);
      });

      var recipeFavoritesIdsValues = await _redisClient2.default.exec();
      var recipeFavoritesIdsObject = {};

      for (var index = 0; index < recipeFavoritesIds.length; index += 1) {
        var recipeId = recipeFavoritesIds[index].slice(0, -10).slice(-36);
        recipeFavoritesIdsObject[recipeId] = recipeFavoritesIdsValues[index].length;
      }

      var sortedRecipeIds = Object.keys(recipeFavoritesIdsObject).sort(function (a, b) {
        return recipeFavoritesIdsObject[a] < recipeFavoritesIdsObject[b];
      });

      var mostFavoritedRecipes = await _models2.default.Recipe.findAll({
        where: {
          id: _defineProperty({}, _models2.default.Sequelize.Op.in, sortedRecipeIds.slice(0, 3))
        },
        include: {
          model: _models2.default.User,
          attributes: { exclude: ['password'] }
        }
      });

      mostFavoritedRecipes.sort(function (r1, r2) {
        return r1.get().favoritersIds.length < r2.get().favoritersIds.length;
      });

      // Get the most favorited recipes end

      // Get the latest recipes begin
      var latestRecipes = await _models2.default.Recipe.findAll({
        limit: 6,
        order: [['createdAt', 'DESC']],
        include: {
          model: _models2.default.User,
          attributes: { exclude: ['password'] }
        }
      });

      // Get the latest recipes end


      return res.sendSuccessResponse({
        mostFavoritedRecipes: mostFavoritedRecipes,
        latestRecipes: latestRecipes
      });
    }

    /**
     * Get the three most favorited recipes
     *
     * @memberof FrontEndController
     * @returns {array} array of models.Recipe
     */

  }, {
    key: 'getMostFavoritedRecipes',
    value: async function getMostFavoritedRecipes() {
      var recipeFavoritesIds = await _redisClient2.default.keys('recipe:*:favorites');
      // using redis pipelines, get their respective values
      _redisClient2.default.multi();
      recipeFavoritesIds.forEach(function (id) {
        return _redisClient2.default.smembers(id);
      });

      var recipeFavoritesIdsValues = await _redisClient2.default.exec();
      var recipeFavoritesIdsObject = {};

      for (var index = 0; index < recipeFavoritesIds.length; index += 1) {
        var recipeId = recipeFavoritesIds[index].slice(0, -10).slice(-36);
        recipeFavoritesIdsObject[recipeId] = recipeFavoritesIdsValues[index].length;
      }

      var sortedRecipeIds = Object.keys(recipeFavoritesIdsObject).sort(function (a, b) {
        return recipeFavoritesIdsObject[a] < recipeFavoritesIdsObject[b];
      });

      var mostFavoritedRecipes = await _models2.default.Recipe.findAll({
        where: {
          id: _defineProperty({}, _models2.default.Sequelize.Op.in, sortedRecipeIds.slice(0, 3))
        },
        include: {
          model: _models2.default.User,
          attributes: { exclude: ['password'] }
        }
      });

      return mostFavoritedRecipes;
    }
  }]);

  return FrontEndController;
}();

exports.default = FrontEndController;