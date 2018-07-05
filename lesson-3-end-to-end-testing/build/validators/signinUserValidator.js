'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./../helpers/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Validate user data for sign in
 */
var SignInUserValidator = function () {
  /**
   * Initialize validator
   * @param {obj} user user details
   */
  function SignInUserValidator(user) {
    _classCallCheck(this, SignInUserValidator);

    this.user = user;

    this.errors = [];
  }
  /**
   * Call validator methods and check if validation was successfull or not
   * @returns {bool} true or false
   */


  _createClass(SignInUserValidator, [{
    key: 'isValid',
    value: function isValid() {
      this.validatePassword();
      this.validateEmail();

      if (this.errors.length > 0) {
        return false;
      }

      return true;
    }
    /**
     * Validate password
     * @returns {null} null
     */

  }, {
    key: 'validatePassword',
    value: function validatePassword() {
      if (!this.user.password) {
        this.errors.push('The password is required.');
      }
    }

    /**
     * Validate user email
     * @returns {null} null
     */

  }, {
    key: 'validateEmail',
    value: async function validateEmail() {
      if (this.user.email) {
        if (!(0, _index2.default)(this.user.email)) {
          this.errors.push('The email must be a valid email address.');
        }
      } else {
        this.errors.push('The email is required.');
      }
    }
  }]);

  return SignInUserValidator;
}();

exports.default = SignInUserValidator;