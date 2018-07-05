'use strict';

var _chai = require('chai');

var _validators = require('./../../validators');

var _validators2 = _interopRequireDefault(_validators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
describe('StoreRecipesValidator', function () {
  describe('validateTitle', function () {
    it('Should return `The title is required.` if the title is not provided', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ description: 'description' });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.not.be.empty;
      (0, _chai.expect)(validator.errors).to.include.members(['The title is required.']);
    });

    it('Should return `The title must be longer than 5 characters.` if the title is a short one', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ title: 'ABCD' });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.not.be.empty;
      (0, _chai.expect)(validator.errors).to.include.members(['The title must be longer than 5 characters.']);
    });
  });

  describe('isValid', function () {
    it('Should return `No recipe was provided.` if no data is passed in request', function () {
      var validator = new _validators2.default.StoreRecipeValidator();

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['No recipe was provided.']);
    });
  });

  describe('validateDescription', function () {
    it('Should return `The description is required.` if the description is not provided', function () {
      var validator = new _validators2.default.StoreRecipeValidator({});

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['The description is required.']);
    });
    it('Should return `The description must be longer than 5 characters.` if the description is not provided', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ description: 'DESC' });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['The description must be longer than 5 characters.']);
    });
  });

  describe('validateTimeToCook', function () {
    it('Should return `The time to cook is required.` if the time to cook is not provided', function () {
      var validator = new _validators2.default.StoreRecipeValidator({});

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['The time to cook is required.']);
    });
    it('Should return `The time to cook must be a number in minutes.` if the time to cook is not a number', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ timeToCook: 'NOT_A_NUMBER' });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['The time to cook must be a number in minutes.']);
    });
  });

  describe('validateIngredients', function () {
    it('Should return `The ingredients must be a json list of ingredients.` if the data passed is not a json', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ ingredients: "NOT_A_JSON" });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['The ingredients must be a json list of ingredients.']);
    });
    it('Should return `There must be a list of ingredients.` if the data passed is json, but not an array', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ ingredients: '{"not_array":"json"}' });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['There must be a list of ingredients.']);
    });

    it('Should return `There must be at least one ingredient.` if the data passed is a json empty array', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ ingredients: JSON.stringify([]) });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['There must be at least one ingredient.']);
    });

    it('Should return `The ingredients are required.` if no ingredients are passed', function () {
      var validator = new _validators2.default.StoreRecipeValidator({});

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['The ingredients are required.']);
    });
  });

  describe('validateProcedure', function () {
    it('Should return `The procedure must be a json of procedural steps` if the data passed is not a json', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ procedure: "NOT_A_JSON" });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['The procedure must be a json of procedural steps.']);
    });
    it('Should return `There must be a list of procedure steps.` if the data passed is json, but not an array', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ procedure: '{"not_array":"json"}' });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['There must be a list of procedure steps.']);
    });

    it('Should return `There must be at least one procedure step.` if the data passed is a json empty array', function () {
      var validator = new _validators2.default.StoreRecipeValidator({ procedure: JSON.stringify([]) });

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['There must be at least one procedure step.']);
    });

    it('Should return `The procedure is required.` if no procedure is passed', function () {
      var validator = new _validators2.default.StoreRecipeValidator({});

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.include.members(['The procedure is required.']);
    });
  });
});