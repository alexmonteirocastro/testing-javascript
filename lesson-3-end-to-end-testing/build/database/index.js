'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Temporary json store interactor for now
 */
var Database = function () {
  /**
   * Initialize the database records
   */
  function Database() {
    _classCallCheck(this, Database);

    this.recipes = _db2.default;
  }

  /**
   * Dummy persist a record to database
   * @param {object} recipe recipe to be saved to database
   * @returns {Promise} promise with recipe
   */


  _createClass(Database, [{
    key: 'save',
    value: function save(recipe) {
      var _this = this;

      return new Promise(function (resolve) {
        recipe.id = _this.generateRandomId();
        recipe.createdAt = new Date();
        recipe.updatedAt = new Date();
        recipe.upvotes = 0;
        recipe.downvotes = 0;
        recipe.favorites = 0;
        recipe.ingredients = JSON.parse(recipe.ingredients);
        recipe.procedure = JSON.parse(recipe.procedure);

        _this.recipes.push(recipe);

        return resolve(recipe);
      });
    }
    /**
     * Dummy update a record to database
     * @param {object} recipeId id of recipe to be updated to database
     * @param {object} newRecipe the new data for the recipe from request
     * @returns {Promise} promise with recipe
     */

  }, {
    key: 'update',
    value: function update(recipeId, newRecipe) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var recipe = _this2.findById(recipeId);
        if (!recipe) {
          return reject(Error('The record could not be found in the database.'));
        }

        recipe.title = newRecipe.title;
        recipe.description = newRecipe.description;
        recipe.time_to_cook = newRecipe.time_to_cook;
        recipe.updatedAt = new Date();
        recipe.ingredients = JSON.parse(newRecipe.ingredients);
        recipe.procedure = JSON.parse(newRecipe.procedure);

        _this2.recipes.splice(_this2.findIndexById(recipe.id), 1, recipe);

        return resolve(recipe);
      });
    }

    /**
     * Delete a recipe from storage
     * @param {number} recipeId id of recipe to be deleted
     * @returns {Promise} Promise
     * @memberof Database
     */

  }, {
    key: 'delete',
    value: function _delete(recipeId) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var recipe = _this3.findById(recipeId);
        if (!recipe) {
          return reject(Error('Recipe was not found in the database.'));
        }

        _this3.recipes.splice(_this3.findIndexById(recipe.id), 1);

        return resolve('Recipe deleted.');
      });
    }

    /**
     * Find a recipe using its id
     * @param {any} recipeId id of recipe to find
     * @returns {object} recipe
     * @memberof Database
     */

  }, {
    key: 'findById',
    value: function findById(recipeId) {
      return this.recipes.find(function (rec) {
        return rec.id === parseInt(recipeId, 10);
      });
    }
    /**
     * Find index of a recipe using its id
     * @param {any} recipeId id of recipe to find
     * @returns {object} recipe
     * @memberof Database
     */

  }, {
    key: 'findIndexById',
    value: function findIndexById(recipeId) {
      return this.recipes.findIndex(function (rec) {
        return rec.id === parseInt(recipeId, 10);
      });
    }

    /**
     * Save a review for a recipe
     * @param {any} recipeId recipe id
     * @param {string} review review to be saved
     * @returns {Promise} resolved with recipe, rejects with error
     * @memberof Database
     */

  }, {
    key: 'saveReview',
    value: function saveReview(recipeId, review) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var recipe = _this4.findById(recipeId);
        if (!recipe) {
          return reject(Error('The recipe was not found in the database.'));
        }

        recipe.reviews = [];
        recipe.reviews.push(review);
        return resolve(recipe);
      });
    }
    /**
     * Upvote a recipe
     * @param {Number} recipeId id of recipe to be upvoted
     * @returns {Promise} resolves with recipe
     * @memberof Database
     */

  }, {
    key: 'upvote',
    value: function upvote(recipeId) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var recipe = _this5.findById(recipeId);
        if (!recipe) {
          return reject(Error('The recipe was not found in the database.'));
        }

        recipe.upvotes += 1;

        _this5.recipes.splice(_this5.findIndexById(recipe.id), 1, recipe);

        return resolve(recipe);
      });
    }

    /**
     * Downvote a recipe
     * @param {Number} recipeId id of recipe to be downvoted
     * @returns {Promise} resolves with recipe
     * @memberof Database
     */

  }, {
    key: 'downvote',
    value: function downvote(recipeId) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var recipe = _this6.findById(recipeId);
        if (!recipe) {
          return reject(Error('The recipe was not found in the database.'));
        }

        recipe.downvotes += 1;

        _this6.recipes.splice(_this6.findIndexById(recipe.id), 1, recipe);

        return resolve(recipe);
      });
    }
    /**
     * Generates a random id for a newly created recipe
     * @returns {Number} number
     * @memberof Database
     */

  }, {
    key: 'generateRandomId',
    value: function generateRandomId() {
      return Math.floor(Math.random() * (Math.ceil(10000) - Math.floor(5000))) + Math.floor(5000);
    }
  }]);

  return Database;
}();

exports.default = Database;