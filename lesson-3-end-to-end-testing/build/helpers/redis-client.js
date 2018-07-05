'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _thenRedis = require('then-redis');

//  import FakeRedis from './redis/fakeRedis';
/**
 * Create a new client redis
 * @returns {object} fake-redis client for testing and real redis-client in production
 */
var getRedisClient = function getRedisClient() {
  if (process.env.NODE_ENV === 'production') {
    return (0, _thenRedis.createClient)(process.env.REDIS_URL);
  }

  return (0, _thenRedis.createClient)();
};

exports.default = getRedisClient();