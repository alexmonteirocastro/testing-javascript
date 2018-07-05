'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../database/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Controller to handle all reviews for recipes
 * @export ReviewsController
 * @class ReviewsController
 */
var ReviewsController = function () {
  function ReviewsController() {
    _classCallCheck(this, ReviewsController);
  }

  _createClass(ReviewsController, [{
    key: 'index',

    /**
     * Get all reviews for a recipe
     * @param {any} req express request object
     * @param {any} res express response object
     * @memberof ReviewsController
     * @returns {array} array of recipes
     */
    value: async function index(req, res) {
      var recipe = req.currentRecipe;

      var reviews = await recipe.getReviews({
        include: { model: _models2.default.User, attributes: { exclude: ['password'] } }
      });

      return res.sendSuccessResponse({ reviews: reviews });
    }

    /**
     * Store a new review to the database
     * @param {any} req express request object
     * @param {any} res express response object
     * @returns {json} json of newly saved review
     * @memberof ReviewsController
     */

  }, {
    key: 'create',
    value: async function create(req, res) {
      var createdReview = await _models2.default.Review.create({
        review: req.body.review,
        recipeId: req.currentRecipe.id,
        userId: req.authUser.id
      });

      var review = await _models2.default.Review.findById(createdReview.id, {
        include: { model: _models2.default.User, exclude: ['password'] }
      });
      return res.sendSuccessResponse({ review: review, message: 'Recipe reviewed successfully.' });
    }
  }]);

  return ReviewsController;
}();

exports.default = ReviewsController;