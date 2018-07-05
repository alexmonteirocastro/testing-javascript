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

describe('/recipes', function () {
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
  });

  describe('/recipes GET endpoint', function () {

    it('Should return a list of recipes when called', function (done) {
      _chai2.default.request(_index2.default).get('/api/v1/recipes').end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(200);
        var res = response.body;
        var recipes = res.data.recipes.recipes;


        (0, _chai.expect)(Array.isArray(recipes)).to.be.true;
        (0, _chai.expect)(recipes[0].id).to.equal(globalMock.recipe1.id);
        (0, _chai.expect)(recipes[0].title).to.equal(globalMock.recipe1.title);
        (0, _chai.expect)(recipes[0].User.name).to.equal(globalMock.user1.name);
        done();
      });
    });
  });

  describe('/recipes POST endpoint', function () {
    it('Should return the newly created recipe', function (done) {

      _chai2.default.request(_index2.default).post('/api/v1/recipes').set('x-access-token', globalMock.user1.authToken).send({
        title: 'Vegetable Salad',
        description: 'this stuff is not nice, really. am just building my api.',
        imageUrl: 'https://i.imgur.com/av7fjeA.jpg',
        timeToCook: 205,
        ingredients: JSON.stringify(["2 pieces Carrots", "Handful Lettuces", "1 sized Cucumber", "1/2 medium sized Cabbage", "1 tin sweet corn"]),
        procedure: JSON.stringify(["Wash all the vegetables with enough water and salt."])
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(201);

        var recipe = response.body.data.recipe;


        (0, _chai.expect)(recipe.title).to.equal('Vegetable Salad');
        (0, _chai.expect)(recipe.description).to.equal('this stuff is not nice, really. am just building my api.');
        (0, _chai.expect)(recipe.timeToCook).to.equal(205);
        (0, _chai.expect)(JSON.parse(recipe.ingredients)[0]).to.equal('2 pieces Carrots');
        (0, _chai.expect)(JSON.parse(recipe.procedure)[0]).to.equal('Wash all the vegetables with enough water and salt.');

        done();
      });
    });

    it('Should return the correct validation errors if there are any', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/recipes').set('x-access-token', globalMock.user1.authToken).send({
        imageUrl: 'SOME_INVALID_IMAGE_URL',
        ingredients: JSON.stringify(["2 pieces Carrots", "Handful Lettuces", "1 sized Cucumber", "1/2 medium sized Cabbage", "1 tin sweet corn", "1 big tin Heinz baked beans", "1 tbsp mayonaise", "1 tin green peas", "2 cksp Salad cream", "2 boiled eggs"]),
        procedure: JSON.stringify(["Wash all the vegetables with enough water and salt.", "Slice nicely cabbage, lettuce and dice the cucumber and carrot and set aside.", "Dice boiled eggs, sieve water off the sweet corn and green pea and set aside", "Arrange all the vegetables in a plate.", "Pour salad cream and mayonnaise in a small bowl and add a dash of black pepper if you wish for a nice zing then mix with the salad and serve"])
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);

        var res = response.body;
        (0, _chai.expect)(res.data.errors).to.have.members(['The title is required.', 'The description is required.', 'The time to cook is required.', 'The image url must be a valid web url.']);
        done();
      });
    });

    it('Should return unauthenticated if there is no valid access_token', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/recipes').send({}).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(401);
        (0, _chai.expect)(response.body.data.message).to.equal('Unauthenticated.');

        done();
      });
    });
  });

  describe('/recipes/:id PUT endpoint', function () {
    it('Should update the recipe, and return the updated recipe', function (done) {
      _chai2.default.request(_index2.default).put('/api/v1/recipes/' + globalMock.recipe1.id).set('x-access-token', globalMock.user1.authToken).send({
        title: 'Vegetable Salad Updated title',
        description: 'this stuff is not nice, really. am just building my api - updated.'
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(200);
        var resp = response.body;

        (0, _chai.expect)(resp.data.id).to.equal(globalMock.recipe1.id);
        (0, _chai.expect)(resp.data.title).to.equal('Vegetable Salad Updated title');
        (0, _chai.expect)(resp.data.description).to.equal('this stuff is not nice, really. am just building my api - updated.');
        (0, _chai.expect)(resp.data.timeToCook).to.equal(globalMock.recipe1.timeToCook);
        (0, _chai.expect)(JSON.parse(resp.data.ingredients)[0]).to.equal(JSON.parse(globalMock.recipe1.ingredients)[0]);
        done();
      });
    });
    it('Should return correct validation errors if there are any', function (done) {
      _chai2.default.request(_index2.default).put('/api/v1/recipes/' + globalMock.recipe1.id).set('x-access-token', globalMock.user1.authToken).send({
        description: 'this',
        ingredients: JSON.stringify([]),
        procedure: ['mix', 'fry', 'eat']
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);
        var resp = response.body;

        (0, _chai.expect)(resp.data.errors).to.have.members(['The description must be longer than 5 characters.', 'There must be at least one ingredient.', 'The procedure must be a json of procedural steps.']);
        done();
      });
    });
    it('Should return correct validation errors if there are any', function (done) {
      _chai2.default.request(_index2.default).put('/api/v1/recipes/' + globalMock.recipe1.id).set('x-access-token', globalMock.user1.authToken).send({
        imageUrl: 'SOME_INVALID_IMAGE_URL',
        ingredients: ['eggs', 'milk'],
        procedure: JSON.stringify([])
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);
        var resp = response.body;

        (0, _chai.expect)(resp.data.errors).to.have.members(['The image url must be a valid web url.', 'There must be at least one procedure step.', 'The ingredients must be a json list of ingredients.']);
        done();
      });
    });
    it('Should return correct validation errors if there are any', function (done) {
      _chai2.default.request(_index2.default).put('/api/v1/recipes/' + globalMock.recipe1.id).set('x-access-token', globalMock.user1.authToken).send({
        title: 'ERR',
        timeToCook: 'SOME_INVALID_TIME_TO_COOK',
        ingredients: JSON.stringify('SOME INVALID JSON INGREDIENTS'),
        procedure: JSON.stringify('SOME INVALID JSON PROCEDURE')
      }).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(422);
        var resp = response.body;

        (0, _chai.expect)(resp.data.errors).to.have.members(['There must be a list of ingredients.', 'There must be a list of procedure steps.', 'The title must be longer than 5 characters.', 'The time to cook must be a number in minutes.']);
        done();
      });
    });
    it('Should return a 404 if the recipe is not found', function (done) {
      var invalidRecipeId = '630de7cc-e5cb-413e-a3b9-809c98b6c08q';
      _chai2.default.request(_index2.default).put('/api/v1/recipes/' + invalidRecipeId).set('x-access-token', globalMock.user1.authToken).send({}).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(404);

        (0, _chai.expect)(response.body.data.message).to.equal('Recipe not found.');
        done();
      });
    });
    it('Should only update the recipe if the creator is the authenticated user trying to update it', function (done) {
      _chai2.default.request(_index2.default).put('/api/v1/recipes/' + globalMock.recipe1.id).set('x-access-token', globalMock.user2.authToken).send({}).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(401);
        var resp = response.body;

        (0, _chai.expect)(response.body.data.message).to.equal('Unauthorized.');
        done();
      });
    });
  });

  describe('/recipes/:id DELETE endpoint', function () {
    it('Should delete the recipe with specified id', function (done) {
      _chai2.default.request(_index2.default).delete('/api/v1/recipes/' + globalMock.recipe1.id).set('x-access-token', globalMock.user1.authToken).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(200);

        (0, _chai.expect)(response.body.data.message).to.equal('Recipe deleted.');
        done();
      });
    });

    it('Should only delete recipe if the creator is the authenticated user trying to delete it.', function (done) {
      _chai2.default.request(_index2.default).delete('/api/v1/recipes/' + globalMock.recipe1.id).set('x-access-token', globalMock.user2.authToken).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(401);

        (0, _chai.expect)(response.body.data.message).to.equal('Unauthorized.');
        done();
      });
    });

    it('Should return a 404 if the recipe is not found', function (done) {
      var invalidRecipeId = '130de7cc-e5cb-413e-a3b9-809c98b6c08q';
      _chai2.default.request(_index2.default).delete('/api/v1/recipes/' + invalidRecipeId).set('x-access-token', globalMock.user1.authToken).end(function (error, response) {
        (0, _chai.expect)(response).to.have.status(404);

        (0, _chai.expect)(response.body.data.message).to.equal('Recipe not found.');
        done();
      });
    });
  });
});