'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _models = require('../database/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Express middleware to verify if request has jwt auth token
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express middleware next() function
 * @returns {function} express next() function
 */
exports.default = async function (req, res, next) {
  var accessToken = req.body.access_token || req.query.access_token || req.headers['x-access-token'];

  try {
    var userData = _jsonwebtoken2.default.verify(accessToken, _config2.default.JWT_SECRET);
    var user = await _models2.default.User.findOne({ where: { email: userData.email } });
    if (user) {
      req.authUser = user.get();
      req.authUserObj = user;
      return next();
    }
  } catch (error) {
    return res.sendFailureResponse({ message: 'Unauthenticated.' }, 401);
  }
};