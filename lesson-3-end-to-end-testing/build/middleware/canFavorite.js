'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Express middleware to verify if request has jwt auth token
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express middleware next() function
 * @returns {function} express next() function
 */
exports.default = async function (req, res, next) {
  if (req.currentRecipe.userId === req.authUser.id) {
    return res.sendFailureResponse({ message: 'Unauthorized.' }, 401);
  }

  next();
};