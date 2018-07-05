import validators from '../validators';

/**
 * Express middleware to verify if request has jwt auth token
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express middleware next() function
 * @returns {function} express next() function
 */
export default async (req, res, next) => {
  const validator = new validators.StoreReviewValidator(req.body.review);

  if (!validator.isValid()) {
    return res.sendFailureResponse(validator.errors, 422);
  }

  next();
};
