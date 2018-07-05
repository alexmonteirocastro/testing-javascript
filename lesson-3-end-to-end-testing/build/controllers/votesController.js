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
 * Class VotesCorntroller to take care of all votes
 */
var VotesController = function () {
  function VotesController() {
    _classCallCheck(this, VotesController);
  }

  _createClass(VotesController, [{
    key: 'getVoters',

    /**
     * Return all upvoters for a recipe
     * @param {obj} req express request object
     * @param {obj} res express response object
     * @returns {array} array of users
     * @memberof VotesController
     */
    value: async function getVoters(req, res) {
      var recipe = await _models2.default.Recipe.findById(req.params.id);

      if (!recipe) {
        return res.sendFailureResponse({ message: 'Recipe not found.' });
      }

      var upvotersUserIds = await _redisClient2.default.smembers('recipe:' + recipe.id + ':upvotes');
      var downvotersUserIds = await _redisClient2.default.smembers('recipe:' + recipe.id + ':downvotes');

      var upvoters = await _models2.default.User.findAll({
        where: {
          id: _defineProperty({}, _models2.default.Sequelize.Op.in, upvotersUserIds)
        }
      });

      var downvoters = await _models2.default.User.findAll({
        where: {
          id: _defineProperty({}, _models2.default.Sequelize.Op.in, downvotersUserIds)
        }
      });

      return res.sendSuccessResponse({ upvoters: upvoters, downvoters: downvoters });
    }

    /**
     * Upvote a recipe
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {json} json
     * @memberof RecipesController
     */

  }, {
    key: 'upvote',
    value: async function upvote(req, res) {
      var recipe = await (0, _helpers.updateRecipeAttributes)(req.currentRecipe);

      if (recipe.upvotersIds.findIndex(function (user) {
        return user === req.authUser.id;
      }) !== -1) {
        await _redisClient2.default.srem('recipe:' + recipe.id + ':upvotes', req.authUser.id);
      } else {
        await _redisClient2.default.sadd('recipe:' + recipe.id + ':upvotes', req.authUser.id);
      }

      return res.sendSuccessResponse({ message: 'Recipe upvoted.' });
    }

    /**
     * Upvote a recipe
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {json} json
     * @memberof RecipesController
     */

  }, {
    key: 'downvote',
    value: async function downvote(req, res) {
      var recipe = await (0, _helpers.updateRecipeAttributes)(req.currentRecipe);

      if (recipe.downvotersIds.findIndex(function (user) {
        return user === req.authUser.id;
      }) !== -1) {
        await _redisClient2.default.srem('recipe:' + recipe.id + ':downvotes', req.authUser.id);
      } else {
        await _redisClient2.default.sadd('recipe:' + recipe.id + ':downvotes', req.authUser.id);
      }

      return res.sendSuccessResponse({ message: 'Recipe downvoted.' });
    }
  }]);

  return VotesController;
}();

exports.default = VotesController;