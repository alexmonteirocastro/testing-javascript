'use strict';

var _chai = require('chai');

var _validators = require('../../validators');

var _validators2 = _interopRequireDefault(_validators);

var _models = require('../../database/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('RegisterUserValidation', function () {
  describe('validateEmail', function () {
    it('Should return the `The email is required` if there is no email provided', async function () {
      var validator = new _validators2.default.RegisterUserValidator({
        name: 'kati frantz',
        password: 'password'
      });

      var isValid = await validator.isValid();
      (0, _chai.expect)(isValid).to.be.false;
      (0, _chai.expect)(validator.errors).to.include('The email is required.');
    });

    it('Should return the `The email must be a valid email address.` if the email provided is not valid', async function () {
      var validator = new _validators2.default.RegisterUserValidator({
        email: 'kati@frantz'
      });

      var isValid = await validator.isValid();
      (0, _chai.expect)(isValid).to.be.false;
      (0, _chai.expect)(validator.errors).to.include('The email must be a valid email address.');
    });

    it('Should return make sure name and password are at least 5 characters long', async function () {
      var validator = new _validators2.default.RegisterUserValidator({
        name: 'kati',
        email: 'valid@email-address.com',
        password: 'pass'
      });

      var isValid = await validator.isValid();
      (0, _chai.expect)(isValid).to.be.false;
      (0, _chai.expect)(validator.errors).to.have.members(['The name must be longer than 5 characters.', 'The password must be longer than 5 characters.']);
    });

    it('Should return the `A user with this email already exists.` if the email provided is already taken valid', async function () {
      await _models2.default.User.create({
        name: 'kati frantz',
        email: 'john@kenedy.com',
        password: 'password'
      });

      var validator = new _validators2.default.RegisterUserValidator({
        email: 'kati@frantz.com'
      });

      var isValid = await validator.isValid();
      (0, _chai.expect)(isValid).to.be.false;
      (0, _chai.expect)(validator.errors).to.include('A user with this email already exists.');
    });
  });
}); /* eslint-disable */