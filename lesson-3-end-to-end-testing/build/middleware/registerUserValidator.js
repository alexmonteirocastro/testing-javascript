'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validators = require('../validators');

var _validators2 = _interopRequireDefault(_validators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Middleware to validate creating a recipe
 * @param {req} req express req object
 * @param {res} res express res object
 * @param {next} next express next method
 * @returns {next} next - express next method
 */
exports.default = async function (req, res, next) {
  var validator = new _validators2.default.RegisterUserValidator(req.body);
  var isValid = await validator.isValid();
  if (!isValid) {
    return res.sendFailureResponse({ errors: validator.errors }, 422);
  }

  next();
};