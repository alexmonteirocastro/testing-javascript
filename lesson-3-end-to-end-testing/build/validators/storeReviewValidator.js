'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Validate storing a review into database
 * @export
 * @class StoreReviewValidator
 */
var StoreReviewValidator = function () {
  /**
   * Creates an instance of StoreReviewValidator.
   * @param {any} review review from request
   * @memberof StoreReviewValidator
   */
  function StoreReviewValidator(review) {
    _classCallCheck(this, StoreReviewValidator);

    this.review = review;

    this.errors = [];
  }

  /**
   * Check if request data is valid
   * @returns {boolean} true or false
   * @memberof StoreReviewValidator
   */


  _createClass(StoreReviewValidator, [{
    key: 'isValid',
    value: function isValid() {
      this.validateReview();

      if (this.errors.length > 0) {
        return false;
      }

      return true;
    }

    /**
     * Validate the review from request
     * @memberof StoreReviewValidator
     * @returns {null} null
     */

  }, {
    key: 'validateReview',
    value: function validateReview() {
      if (this.review) {
        if (this.review.length < 5) {
          this.errors.push('The review must be longer than 5 characters.');
        }
      } else {
        this.errors.push('The review is required.');
      }
    }
  }]);

  return StoreReviewValidator;
}();

exports.default = StoreReviewValidator;