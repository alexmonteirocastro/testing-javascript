'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _models = require('../database/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Controls endpoints for authentication
 * @class AuthController
 */
var AuthController = function () {
  function AuthController() {
    _classCallCheck(this, AuthController);
  }

  _createClass(AuthController, [{
    key: 'signup',

    /**
    * Register a new user
    * @param {object} req express request object
    * @param {object} res express response object
    * @returns {object} newly created user
    */
    value: async function signup(req, res) {
      var user = await _models2.default.User.create({
        name: req.body.name,
        email: req.body.email,
        password: await _bcrypt2.default.hash(req.body.password, 10)
      });
      var accessToken = _jsonwebtoken2.default.sign({ email: user.email }, _config2.default.JWT_SECRET);
      return res.sendSuccessResponse({ user: user, access_token: accessToken });
    }

    /**
     * Sign in a user
     * @param {obj} req express request object
     * @param {obj} res express response object
     * @returns {json} json with user access_token
     */

  }, {
    key: 'signin',
    value: async function signin(req, res) {
      try {
        var user = await _models2.default.User.findOne({ where: { email: req.body.email } });
        if (user) {
          var isCorrectPassword = await _bcrypt2.default.compare(req.body.password, user.password);
          if (isCorrectPassword) {
            var accessToken = _jsonwebtoken2.default.sign({ email: user.email }, _config2.default.JWT_SECRET);
            return res.sendSuccessResponse({ user: user, access_token: accessToken });
          }

          throw new Error('The passwords did not match.');
        }

        throw new Error('No user was found.');
      } catch (error) {
        return res.sendFailureResponse({ message: 'These credentials do not match our records.' }, 422);
      }
    }
  }]);

  return AuthController;
}();

exports.default = AuthController;