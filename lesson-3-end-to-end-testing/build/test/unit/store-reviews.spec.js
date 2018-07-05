'use strict';

var _chai = require('chai');

var _validators = require('./../../validators');

var _validators2 = _interopRequireDefault(_validators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
describe('StoreReviewValidator', function () {
  describe('validateReview', function () {
    it('Should return `The review is required.` if the review is not provided', function () {
      var validator = new _validators2.default.StoreReviewValidator();

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.not.be.empty;
      (0, _chai.expect)(validator.errors).to.include.members(['The review is required.']);
    });
    it('Should return `The review must be longer than 5 characters.` if the review is not long enough', function () {
      var validator = new _validators2.default.StoreReviewValidator('REVI');

      (0, _chai.expect)(validator.isValid()).to.be.false;
      (0, _chai.expect)(validator.errors).to.not.be.empty;
      (0, _chai.expect)(validator.errors).to.include.members(['The review must be longer than 5 characters.']);
    });
  });
});