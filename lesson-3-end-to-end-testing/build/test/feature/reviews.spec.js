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

var _index = require('./../../index.js');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../../database/models/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default); /* eslint-disable */

var globalMock = {};

describe('/recipes/:id/reviews', function () {
  beforeEach(async function () {
    await _index4.default.User.destroy({ where: {}, truncate: true });
    await _index4.default.Recipe.destroy({ where: {}, truncate: true });

    globalMock.user1 = await _index4.default.User.create({
      name: 'kati frantz',
      email: 'kati@frantz.com',
      password: await _bcrypt2.default.hash('secret', 10)
    });

    globalMock.user2 = await _index4.default.User.create({
      name: 'Doctor strange',
      email: 'doctor@strange.com',
      password: await _bcrypt2.default.hash('secret', 10)
    });

    globalMock.user1.authToken = _jsonwebtoken2.default.sign({ email: globalMock.user1.email }, _config2.default.JWT_SECRET);
    globalMock.user2.authToken = _jsonwebtoken2.default.sign({ email: globalMock.user2.email }, _config2.default.JWT_SECRET);

    globalMock.recipe1 = await _index4.default.Recipe.create({
      title: 'Vegetable Salad',
      description: 'this stuff is not nice, really. am just building my api.',
      imageUrl: 'https://i.imgur.com/av7fjeA.jpg',
      timeToCook: 205,
      ingredients: JSON.stringify(["2 pieces Carrots", "Handful Lettuces"]),
      procedure: JSON.stringify(["Wash all the vegetables with enough water and salt."]),
      userId: globalMock.user1.id
    });

    globalMock.review1 = await _index4.default.Review.create({
      review: 'REVIEW_BODY',
      recipeId: globalMock.recipe1.id,
      userId: globalMock.user2.id
    });
  });

  describe('/recipes/:id/reviews POST endpoint', function () {
    it('Should save a review for the recipe.', function (done) {

      _chai2.default.request(_index2.default).post('/api/v1/recipes/' + globalMock.recipe1.id + '/reviews').set('x-access-token', globalMock.user2.authToken).send({ review: 'I absolutely hate your cooking. Its a mess.' }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(200);
        var responseBody = response.body;

        (0, _chai.expect)(responseBody.data.review.recipeId).to.equal(globalMock.recipe1.id);
        (0, _chai.expect)(responseBody.data.review.review).to.equal('I absolutely hate your cooking. Its a mess.');

        done();
      });
    });

    it('Should return a 404 if the recipe is not found.', function (done) {
      var invalidRecipeId = '630de7cc-e5cb-413e-a3b9-809c98b6c08q';
      _chai2.default.request(_index2.default).post('/api/v1/recipes/' + invalidRecipeId + '/reviews').set('x-access-token', globalMock.user2.authToken).send({ review: 'this is a valid review' }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(404);

        (0, _chai.expect)(response.body.data.message).to.equal('Recipe not found.');
        done();
      });
    });

    it('Should return validation errors if review is not provided', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/recipes/' + globalMock.recipe1.id + '/reviews').set('x-access-token', globalMock.user2.authToken).send({}).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);
        var res = response.body;

        (0, _chai.expect)(res.data).to.include.members(['The review is required.']);

        done();
      });
    });

    it('Should only create reviews for authenticated users', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/recipes/' + globalMock.recipe1.id + '/reviews').send({ review: 'This is a valid review.' }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(401);

        (0, _chai.expect)(response.body.data.message).to.equal('Unauthenticated.');

        done();
      });
    });
  });

  describe('/recipes/:id/reviews GET endpoint', function () {
    it('Should return all the reviews for the recipe', function (done) {
      _chai2.default.request(_index2.default).get('/api/v1/recipes/' + globalMock.recipe1.id + '/reviews').set('x-access-token', globalMock.user2.authToken).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(200);
        var reviews = response.body.data.reviews;

        (0, _chai.expect)(reviews).to.be.an('array');
        (0, _chai.expect)(reviews[0].id).to.equal(globalMock.review1.id);

        done();
      });
    });
  });
});