'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _controllers = require('../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var frontendRouter = new _express.Router();
var frontendController = new _controllers2.default.FrontEndController();

frontendRouter.get('/home', frontendController.home);

exports.default = frontendRouter;