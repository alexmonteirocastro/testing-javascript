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

var _redisClient = require('../../helpers/redis-client');

var _redisClient2 = _interopRequireDefault(_redisClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
_chai2.default.use(_chaiHttp2.default);
var globalMock = {};

describe('/favorites', function () {

  beforeEach(async function () {
    await _index4.default.User.destroy({ where: {}, truncate: true });
    await _index4.default.Recipe.destroy({ where: {}, truncate: true });

    globalMock.user1 = await _index4.default.User.create({
      name: 'kati frantz',
      email: 'kati@frantz.com',
      password: await _bcrypt2.default.hash('secret', 10)
    });

    var recipe = {
      title: 'Vegetable Salad',
      description: 'this stuff is not nice, really. am just building my api.',
      imageUrl: 'https://i.imgur.com/av7fjeA.jpg',
      timeToCook: 205,
      ingredients: JSON.stringify(["2 pieces Carrots", "Handful Lettuces"]),
      procedure: JSON.stringify(["Wash all the vegetables with enough water and salt."]),
      userId: globalMock.user1.id
    };

    globalMock.user2 = await _index4.default.User.create({
      name: 'Doctor strange',
      email: 'doctor@strange.com',
      password: await _bcrypt2.default.hash('secret', 10)
    });

    globalMock.user3 = await _index4.default.User.create({
      name: 'Myers Duraine',
      email: 'myers@duraine.com',
      password: await _bcrypt2.default.hash('secret', 10)
    });

    globalMock.user1.authToken = _jsonwebtoken2.default.sign({ email: globalMock.user1.email }, _config2.default.JWT_SECRET);
    globalMock.user2.authToken = _jsonwebtoken2.default.sign({ email: globalMock.user2.email }, _config2.default.JWT_SECRET);
    globalMock.user3.authToken = _jsonwebtoken2.default.sign({ email: globalMock.user3.email }, _config2.default.JWT_SECRET);

    globalMock.recipe1 = await _index4.default.Recipe.create(recipe);
    globalMock.recipe2 = await _index4.default.Recipe.create(recipe);
  });

  describe('/users/favorites POST', function () {
    it('Should favorite a recipe for a user', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/' + globalMock.recipe1.id + '/favorites').set('x-access-token', globalMock.user2.authToken).end(function (error, response) {

        (0, _chai.expect)(response).to.have.status(200);
        (0, _chai.expect)(response.body.data.message).to.equal('Recipe favorited.');

        done();
      });
    });
    it('Should not allow the creator of a recipe to favorite it', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/' + globalMock.recipe1.id + '/favorites').set('x-access-token', globalMock.user1.authToken).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(401);
        (0, _chai.expect)(response.body.data.message).to.equal('Unauthorized.');

        done();
      });
    });
  });

  describe('/users/favorites GET', function () {
    it('Should get all the favorite recipes for a user', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/users/' + globalMock.recipe1.id + '/favorites').set('x-access-token', globalMock.user2.authToken).end(function (error, response) {

        _chai2.default.request(_index2.default).get('/api/v1/users/favorites').set('x-access-token', globalMock.user2.authToken).end(function (error, response) {
          var responseBody = response.body.data;

          (0, _chai.expect)(response).to.have.status(200);
          (0, _chai.expect)(Array.isArray(responseBody.favorites)).to.be.true;
          (0, _chai.expect)(responseBody.favorites.length).to.equal(1);
          (0, _chai.expect)(responseBody.favorites[0].id).to.equal(globalMock.recipe1.id);

          done();
        });
      });
    });
  });

  describe('/users/update PUT', function () {
    it.skip('Should update the auth user profile', async function () {
      var response = await _chai2.default.request(_index2.default).put('api/v1/users/update').send({
        name: 'Kati Frantz. Vallie',
        about: 'About me updated.'
      }).set('x-access-token', globalMock.user1.authToken);

      (0, _chai.expect)(response).to.have.status(200);
      var user = response.data.user;

      (0, _chai.expect)(user.id).to.equal(globalMock.user1.id);
      (0, _chai.expect)(user.name).to.equal('Kati Frantz. Vallie');
      (0, _chai.expect)(user.about).to.equal('About me updated.');
    });
  });

  describe('/users/:id GET', function () {
    it('Should return the user profile data', async function () {
      var response = await _chai2.default.request(_index2.default).get('/api/v1/users/profile/' + globalMock.user1.id);

      (0, _chai.expect)(response).to.have.status(200);
      (0, _chai.expect)(response.body.data.user.id).to.equal(globalMock.user1.id);
    });
    it('Should return 404 if the user is not found.', function (done) {
      var invalidUserId = '0fa6d51c-08f5-4b49-9b60-37a5037e308q';
      _chai2.default.request(_index2.default).get('/api/v1/users/profile/' + invalidUserId).end(function (error, response) {
        console.log(response.body);
        (0, _chai.expect)(response).to.have.status(404);
        (0, _chai.expect)(response.body.data.message).to.equal('User not found.');

        done();
      });
    });
  });
});