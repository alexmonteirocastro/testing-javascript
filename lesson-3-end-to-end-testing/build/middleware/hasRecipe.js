'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('../database/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Express middleware to verify if request has a valid recipe
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express middleware next() function
 * @returns {function} express next() function
 */
exports.default = async function (req, res, next) {
  try {
    var recipe = await _models2.default.Recipe.findById(req.params.recipeId || req.params.id, {
      include: {
        model: _models2.default.User,
        attributes: { exclude: ['password'] }
      }
    });

    if (!recipe) {
      return res.sendFailureResponse({ message: 'Recipe not found.' }, 404);
    }

    req.currentRecipe = recipe;
    next();
  } catch (error) {
    return res.sendFailureResponse({ message: 'Recipe not found.' }, 404);
  }
};