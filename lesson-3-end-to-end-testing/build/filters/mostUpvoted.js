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

var filterMostUpvotedRecipes = async function filterMostUpvotedRecipes(page, perPage) {
  var recipeUpvotesIds = await _redisClient2.default.keys('recipe:*:upvotes');

  _redisClient2.default.multi();
  recipeUpvotesIds.forEach(function (id) {
    return _redisClient2.default.smembers(id);
  });

  var recipeUpvotesIdsValues = await _redisClient2.default.exec();
  var recipeUpvotesIdsObject = {};

  for (var index = 0; index < recipeUpvotesIds.length; index += 1) {
    var recipeId = recipeUpvotesIds[index].slice(0, -8).slice(-36);
    recipeUpvotesIdsObject[recipeId] = recipeUpvotesIdsValues[index].length;
  }

  var sortedRecipeIds = Object.keys(recipeUpvotesIdsObject).sort(function (a, b) {
    return recipeUpvotesIdsObject[a] < recipeUpvotesIdsObject[b];
  });

  var mostUpvotedRecipes = await _models2.default.Recipe.findAll({
    where: {
      id: _defineProperty({}, _models2.default.Sequelize.Op.in, sortedRecipeIds.slice(page - 1, perPage))
    },
    include: {
      model: _models2.default.User,
      attributes: { exclude: ['password'] }
    }
  });

  mostUpvotedRecipes.sort(function (r1, r2) {
    return r1.get().upvotersIds.length < r2.get().upvotersIds.length;
  });

  return {
    rows: mostUpvotedRecipes,
    count: recipeUpvotesIds.length
  };
};

exports.default = filterMostUpvotedRecipes;