'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('./../database/models');

var _models2 = _interopRequireDefault(_models);

var _redisClient = require('./../helpers/redis-client');

var _redisClient2 = _interopRequireDefault(_redisClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var filterMostFavoritedRecipes = async function filterMostFavoritedRecipes(page, perPage) {
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
      id: _defineProperty({}, _models2.default.Sequelize.Op.in, sortedRecipeIds.slice(page - 1, perPage))
    },
    include: {
      model: _models2.default.User,
      attributes: { exclude: ['password'] }
    }
  });

  mostFavoritedRecipes.sort(function (r1, r2) {
    return r1.get().favoritersIds.length < r2.get().favoritersIds.length;
  });

  return {
    rows: mostFavoritedRecipes,
    count: recipeFavoritesIds.length
  };
};

exports.default = filterMostFavoritedRecipes;