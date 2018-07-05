'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validators = require('../validators');

var _validators2 = _interopRequireDefault(_validators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Express middleware to verify if request has jwt auth token
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express middleware next() function
 * @returns {function} express next() function
 */
exports.default = async function (req, res, next) {
  var validator = new _validators2.default.StoreReviewValidator(req.body.review);

  if (!validator.isValid()) {
    return res.sendFailureResponse(validator.errors, 422);
  }

  next();
};