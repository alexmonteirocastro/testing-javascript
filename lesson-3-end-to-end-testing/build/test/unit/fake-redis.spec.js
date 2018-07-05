'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _fakeRedis = require('../../helpers/redis/fakeRedis');

var _fakeRedis2 = _interopRequireDefault(_fakeRedis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default); /* eslint-disable */


describe('Redis', function () {
  describe('Constructor', function () {
    it('Should set a new database when newed up', function () {
      var redis = new _fakeRedis2.default();

      (0, _chai.expect)(redis.database).to.deep.equal({});
    });
  });

  describe('set', function () {
    it('Should set a key and value to the database', function () {
      var redis = new _fakeRedis2.default();

      redis.set('new-key', 'new-key-value');
      (0, _chai.expect)(redis.database['new-key']).to.equal('new-key-value');
    });

    it('Should return a promise with message ok if the process was successful', function () {
      var redis = new _fakeRedis2.default();

      (0, _chai.expect)(redis.set('key', 'value').then).to.not.be.undefined;
      (0, _chai.expect)(redis.set('key', 'value').catch).to.not.be.undefined;
    });
  });

  describe('get', function () {
    it('Should get a key and value from the database', async function () {
      var redis = new _fakeRedis2.default();

      await redis.set('new-key', 'new-key-value');
      var value = await redis.get('new-key');
      (0, _chai.expect)(value).to.equal('new-key-value');
    });

    it('Should return a promise with key value if the process was successful', async function () {
      var redis = new _fakeRedis2.default();

      await redis.set('new-key', 'new-key-value');
      (0, _chai.expect)(redis.get('new-key').then).to.not.be.undefined;
      (0, _chai.expect)(redis.get('new-key').catch).to.not.be.undefined;
    });
  });

  describe('Sadd', function () {
    it('Should add a value to a new SET key in the database', async function () {
      var redis = new _fakeRedis2.default();

      var result = await redis.sadd('new-key-value-set', 'new-set-value');
      var result2 = await redis.sadd('new-key-value-set', 'new-set-value-2');

      (0, _chai.expect)(result).to.equal(1);
      (0, _chai.expect)(result2).to.equal(1);
    });
  });

  describe('Smembers', function () {
    it('Should return all the values of a set', async function () {
      var redis = new _fakeRedis2.default();

      await redis.sadd('new-key-value-set', 'new-set-value');
      var result = await redis.smembers('new-key-value-set');

      (0, _chai.expect)(result).to.have.members(['new-set-value']);
    });

    it('Should return an empty array if the key does not exist in the database', async function () {
      var redis = new _fakeRedis2.default();

      var result = await redis.smembers('key-does-not-exist');
      (0, _chai.expect)(result).to.have.members([]);
    });

    it('Should reject if the value stored in key is not a set', async function () {
      var redis = new _fakeRedis2.default();

      await redis.set('new-key', 'new-key-value');
      (0, _chai.expect)(redis.smembers('new-key')).to.be.rejectedWith(Error);
    });
  });

  describe('Srem', function () {
    it('Should remove an element from the set', async function () {
      var client = new _fakeRedis2.default();

      await client.sadd('some-new-key', 'some new value');
      var result = await client.srem('some-new-key', 'some new value');
      (0, _chai.expect)(result).to.equal(1);
      var members = await client.smembers('some-new-key');
      (0, _chai.expect)(members).to.have.members([]);
    });
  });
});