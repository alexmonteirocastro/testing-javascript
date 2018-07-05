'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _models = require('../database/models');

var _models2 = _interopRequireDefault(_models);

var _index = require('./../helpers/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Validate request for registering a new user
 */
var RegisterUserValidator = function () {
  /**
   * Initialize validator
   * @param {object} user user data to validate
   */
  function RegisterUserValidator(user) {
    _classCallCheck(this, RegisterUserValidator);

    this.user = user;

    this.errors = [];
  }

  /**
   * Call validations, and check if it passed or not
   * @returns {bool} validation passed or failed
   */


  _createClass(RegisterUserValidator, [{
    key: 'isValid',
    value: async function isValid() {
      this.validateName();
      this.validatePassword();
      await this.validateEmail();

      if (this.errors.length > 0) {
        return false;
      }
      return true;
    }

    /**
     * Validate the user's name
     * @returns {null} null
     */

  }, {
    key: 'validateName',
    value: function validateName() {
      if (this.user.name) {
        if (this.user.name.length < 5) {
          this.errors.push('The name must be longer than 5 characters.');
        }
      } else {
        this.errors.push('The name is required.');
      }
    }

    /**
     * Validate password
     * @returns {null} null
     */

  }, {
    key: 'validatePassword',
    value: function validatePassword() {
      if (this.user.password) {
        if (this.user.password.length < 6) {
          this.errors.push('The password must be longer than 5 characters.');
        }
      } else {
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
        } else {
          var user = await _models2.default.User.findOne({ where: { email: this.user.email } });
          if (user) {
            this.errors.push('A user with this email already exists.');
          }
        }
      } else {
        this.errors.push('The email is required.');
      }
    }
  }]);

  return RegisterUserValidator;
}();

exports.default = RegisterUserValidator;