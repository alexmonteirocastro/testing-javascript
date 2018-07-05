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

describe('/frontend', function () {
  describe('/frontend/home', function () {
    beforeEach(async function () {
      await _index4.default.User.destroy({ where: {}, truncate: true });
      await _index4.default.Recipe.destroy({ where: {}, truncate: true });
      await _redisClient2.default.flushall();

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

      globalMock.user3 = await _index4.default.User.create({
        name: 'Anonymous strange',
        email: 'anonymous@strange.com',
        password: await _bcrypt2.default.hash('secret', 10)
      });

      globalMock.recipe1 = await _index4.default.Recipe.create({
        title: 'Vegetable Salad',
        description: 'this stuff is not nice, really. am just building my api.',
        imageUrl: 'https://i.imgur.com/av7fjeA.jpg',
        timeToCook: 205,
        ingredients: JSON.stringify(["2 pieces Carrots", "Handful Lettuces"]),
        procedure: JSON.stringify(["Wash all the vegetables with enough water and salt."]),
        userId: globalMock.user1.id
      });

      globalMock.recipe2 = await _index4.default.Recipe.create({
        title: 'Vegetable Salad',
        description: 'this stuff is not nice, really. am just building my api.',
        imageUrl: 'https://i.imgur.com/av7fjeA.jpg',
        timeToCook: 205,
        ingredients: JSON.stringify(["2 pieces Carrots", "Handful Lettuces"]),
        procedure: JSON.stringify(["Wash all the vegetables with enough water and salt."]),
        userId: globalMock.user2.id
      });

      globalMock.recipe3 = await _index4.default.Recipe.create({
        title: 'Vegetable Salad',
        description: 'this stuff is not nice, really. am just building my api.',
        imageUrl: 'https://i.imgur.com/av7fjeA.jpg',
        timeToCook: 205,
        ingredients: JSON.stringify(["2 pieces Carrots", "Handful Lettuces"]),
        procedure: JSON.stringify(["Wash all the vegetables with enough water and salt."]),
        userId: globalMock.user3.id
      });

      await _redisClient2.default.sadd('recipe:' + globalMock.recipe1.id + ':favorites', globalMock.user2.id);
      await _redisClient2.default.sadd('recipe:' + globalMock.recipe1.id + ':favorites', globalMock.user3.id);

      await _redisClient2.default.sadd('recipe:' + globalMock.recipe2.id + ':favorites', globalMock.user1.id);
    });

    it('Should return mostFavoriteRecipes, and latestRecipes in correct order', async function () {
      var response = await _chai2.default.request(_index2.default).get('/api/v1/frontend/home');

      var mostFavoritedRecipes = response.body.data.mostFavoritedRecipes;
      var latestRecipes = response.body.data.latestRecipes;


      (0, _chai.expect)(latestRecipes[0].id).to.equal(globalMock.recipe3.id);
      (0, _chai.expect)(latestRecipes[1].id).to.equal(globalMock.recipe2.id);
      (0, _chai.expect)(latestRecipes[2].id).to.equal(globalMock.recipe1.id);

      (0, _chai.expect)(mostFavoritedRecipes[0].id).to.equal(globalMock.recipe1.id);
      (0, _chai.expect)(mostFavoritedRecipes[1].id).to.equal(globalMock.recipe2.id);
    });
  });
});