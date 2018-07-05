'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('../helpers/index');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Validate the data for storing a new recipe
 */
var UpdateRecipeValidator = function () {
  /**
   * Initialize the data to be validated
   * @param {object} recipe the recipe to be validated
   */
  function UpdateRecipeValidator(recipe) {
    _classCallCheck(this, UpdateRecipeValidator);

    this.recipe = recipe;
    this.errors = [];
  }

  /**
   * Validate the recipe
   * @returns {boolean} true or false
   */


  _createClass(UpdateRecipeValidator, [{
    key: 'isValid',
    value: function isValid() {
      this.validateTitle();
      this.validateDescription();
      this.validateTimeToCook();
      this.validateImageUrl();
      this.validateIngredients();
      this.validateProcedure();

      if (this.errors.length > 0) {
        return false;
      }

      return true;
    }

    /**
     * Validate the name field of the request
     * It must be found in request, and it must not be an empty string
     * @returns {null} no return value
     */

  }, {
    key: 'validateTitle',
    value: function validateTitle() {
      if (this.recipe.title) {
        if (this.recipe.title.length < 5) {
          this.errors.push('The title must be longer than 5 characters.');
        }
      }
    }

    /**
     * Validate the name field of the request
     * It must be found in request, and it must
     * @returns {null} no return value
     */

  }, {
    key: 'validateDescription',
    value: function validateDescription() {
      if (this.recipe.description) {
        if (this.recipe.description.length < 5) {
          this.errors.push('The description must be longer than 5 characters.');
        }
      }
    }

    /**
     * Validate the time to cook field
     * @returns {null} null
     */

  }, {
    key: 'validateTimeToCook',
    value: function validateTimeToCook() {
      if (this.recipe.timeToCook) {
        if (Number.isNaN(parseInt(this.recipe.timeToCook, 10))) {
          this.errors.push('The time to cook must be a number in minutes.');
        }
      }
    }

    /**
     * Validate the ingredients field
     * @returns {null} no return
     */

  }, {
    key: 'validateIngredients',
    value: function validateIngredients() {
      var ingredients = this.recipe.ingredients;


      if (ingredients) {
        try {
          ingredients = JSON.parse(ingredients);
        } catch (error) {
          this.errors.push('The ingredients must be a json list of ingredients.');
          return;
        }

        if (!Array.isArray(ingredients)) {
          this.errors.push('There must be a list of ingredients.');
        }

        if (Array.isArray(ingredients)) {
          if (ingredients.length < 1) {
            this.errors.push('There must be at least one ingredient.');
          }
        }
      }
    }

    /**
     * Validate user email
     * @returns {null} null
     */

  }, {
    key: 'validateImageUrl',
    value: function validateImageUrl() {
      if (this.recipe.imageUrl) {
        if (!_index.reWebUrl.test(this.recipe.imageUrl)) {
          this.errors.push('The image url must be a valid web url.');
        }
      }
    }

    /**
     * Validate the procedure field
     * @returns {null} no return
     */

  }, {
    key: 'validateProcedure',
    value: function validateProcedure() {
      var procedure = this.recipe.procedure;


      if (procedure) {
        try {
          procedure = JSON.parse(procedure);
        } catch (error) {
          this.errors.push('The procedure must be a json of procedural steps.');
          return;
        }
        if (!Array.isArray(procedure)) {
          this.errors.push('There must be a list of procedure steps.');
        }

        if (Array.isArray(procedure)) {
          if (procedure.length < 1) {
            this.errors.push('There must be at least one procedure step.');
          }
        }
      }
    }
  }]);

  return UpdateRecipeValidator;
}();

exports.default = UpdateRecipeValidator;