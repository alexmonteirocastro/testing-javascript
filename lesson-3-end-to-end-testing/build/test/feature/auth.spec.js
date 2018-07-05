'use strict';

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../database/models/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default); /* eslint-disable */

var globalMock = {};

describe('/users', function () {
  beforeEach(async function () {
    await _index4.default.User.destroy({ where: {}, truncate: true });
  });
  describe('/signup', function () {
    it('Should register a new user', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/signup').send({
        name: 'brand new user',
        email: 'brand-new@user.com',
        password: 'secret'
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(200);
        var responseData = response.body.data;

        (0, _chai.expect)(responseData.user.id).to.not.be.undefined;
        (0, _chai.expect)(responseData.access_token).to.not.be.undefined;
        done();
      });
    });
    it('Should return correct validator errors if there are any', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/signup').send({
        email: 'brand-new@user.com'
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);
        var responseData = response.body.data;

        (0, _chai.expect)(responseData.errors).to.have.members(['The name is required.', 'The password is required.']);
        done();
      });
    });
  });

  describe('/signin', function () {
    beforeEach(async function () {

      globalMock.user1 = await _index4.default.User.create({
        name: 'kati frantz',
        email: 'kati@frantz.com',
        password: await _bcrypt2.default.hash('secret', 10)
      });
    });
    it('Should return auth token for valid user credentials', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/signin').send({
        email: 'kati@frantz.com',
        password: 'secret'
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(200);
        var responseData = response.body.data;

        (0, _chai.expect)(responseData.user.id).to.equal(globalMock.user1.id);
        (0, _chai.expect)(responseData.access_token).to.not.be.undefined;
        done();
      });
    });
    it('Should return `These credentials do not match our records.` if the user with email is not found.', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/signin').send({
        email: 'fakeAndInexistent@user.com',
        password: 'secret'
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);
        var responseData = response.body.data;

        (0, _chai.expect)(responseData.message).to.equal('These credentials do not match our records.');
        done();
      });
    });
    it('Should return `These credentials do not match our records.` if the user password is not correct', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/signin').send({
        email: 'kati@frantz.com',
        password: 'secret-wrong-password'
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);
        var responseData = response.body.data;

        (0, _chai.expect)(responseData.message).to.equal('These credentials do not match our records.');
        done();
      });
    });
    it('Should return `The password is required.` and `The email is required.` if the user password and email were not provided', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/signin').send({}).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);
        var responseData = response.body.data;

        (0, _chai.expect)(responseData.errors).to.include('The email is required.');
        (0, _chai.expect)(responseData.errors).to.include('The password is required.');
        done();
      });
    });
    it('Should return `The email must be a valid email address.` if the user email is not valid', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/signin').send({
        email: 'SOME_INVALID_EMAIL',
        password: 'SOME_PASSWORD'
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);
        var responseData = response.body.data;

        (0, _chai.expect)(responseData.errors).to.include('The email must be a valid email address.');
        done();
      });
    });
  });
});