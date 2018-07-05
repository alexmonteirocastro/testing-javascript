'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Express middleware to modify response object
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express middleware next() function
 * @returns {function} express next() function
 */
exports.default = function (req, res, next) {
  res.sendSuccessResponse = function (data) {
    var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    return res.status(statusCode).json({
      status: 'success',
      data: data
    });
  };

  res.sendFailureResponse = function (data) {
    var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 404;
    return res.status(statusCode).json({
      status: 'fail',
      data: data
    });
  };

  return next();
};