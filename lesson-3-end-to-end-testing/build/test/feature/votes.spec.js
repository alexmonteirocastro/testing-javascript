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

describe('/votes', function () {

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

  describe('/upvote', function () {
    it('Should upvote a recipe for a user', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/recipes/' + globalMock.recipe1.id + '/upvote').set('x-access-token', globalMock.user2.authToken).end(function (error, response) {

        (0, _chai.expect)(response).to.have.status(200);
        (0, _chai.expect)(response.body.data.message).to.equal('Recipe upvoted.');

        done();
      });
    });
    it('Should only permit other users to upvote recipes and not the creator', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/recipes/' + globalMock.recipe1.id + '/upvote').set('x-access-token', globalMock.user1.authToken).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(401);
        (0, _chai.expect)(response.body.data.message).to.equal('Unauthorized.');

        done();
      });
    });
  });

  describe('/downvote', function () {
    it('Should downvote a recipe for a user', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/recipes/' + globalMock.recipe1.id + '/downvote').set('x-access-token', globalMock.user2.authToken).end(function (error, response) {

        (0, _chai.expect)(response).to.have.status(200);
        (0, _chai.expect)(response.body.data.message).to.equal('Recipe downvoted.');

        done();
      });
    });
    it('Should only permit other users to downvote recipes and not the creator', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/recipes/' + globalMock.recipe1.id + '/downvote').set('x-access-token', globalMock.user1.authToken).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(401);
        (0, _chai.expect)(response.body.data.message).to.equal('Unauthorized.');

        done();
      });
    });
  });

  describe('/voters', function () {
    it('Should get upvoters and downvoters for a recipe', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/recipes/' + globalMock.recipe1.id + '/downvote').set('x-access-token', globalMock.user2.authToken).end(function (error, response) {

        _chai2.default.request(_index2.default).post('/api/v1/recipes/' + globalMock.recipe1.id + '/upvote').set('x-access-token', globalMock.user3.authToken).end(function (error, response) {
          _chai2.default.request(_index2.default).get('/api/v1/recipes/' + globalMock.recipe1.id + '/voters').set('x-access-token', globalMock.user1.authToken).end(function (error, response) {
            var upvoters = response.body.data.upvoters;
            var downvoters = response.body.data.downvoters;


            (0, _chai.expect)(Array.isArray(upvoters)).to.be.true;
            (0, _chai.expect)(Array.isArray(downvoters)).to.be.true;
            (0, _chai.expect)(upvoters[0].id).to.equal(globalMock.user3.id);
            (0, _chai.expect)(downvoters[0].id).to.equal(globalMock.user2.id);
            done();
          });
        });
      });
    });
    it('Should return a 404 if the recipe is not found', function (done) {
      var invalidRecipeId = '630de7cc-e5cb-413e-a3b9-809c98b6c08q';
      _chai2.default.request(_index2.default).get('/api/v1/recipes/' + invalidRecipeId + '/voters').set('x-access-token', globalMock.user2.authToken).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(404);

        (0, _chai.expect)(response.body.data.message).to.equal('Recipe not found.');
        done();
      });
    });
  });
});