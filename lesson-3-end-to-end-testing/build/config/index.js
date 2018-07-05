'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config();

var jwtSecret = process.env.JWT_SECRET;

if (process.env.NODE_ENV === 'test') {
  jwtSecret = 'secret';
}

/**
 * Application wide configurations
 */
exports.default = {
  JWT_SECRET: jwtSecret
};