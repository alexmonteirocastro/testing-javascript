'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _models = require('./database/models');

var _models2 = _interopRequireDefault(_models);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  Configure environment variables

var app = new _express2.default();

//  Enable CORS for the express server
app.use((0, _cors2.default)());
app.options('*', (0, _cors2.default)());

// Enable HTTP REQUEST logging
app.use((0, _morgan2.default)('combined'));

var port = process.env.PORT || 4080;
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

//  app.set('view engine', 'ejs');
//  app.set('views', path.join(__dirname, '/views'));
//  app.set('appPath', 'public');
app.use(_express2.default.static(_path2.default.join(__dirname, '/public')));
//  app.get('/', (req, res) => res.render('index'));

app.use(_middleware2.default.api);

app.use('/api/v1/users', _routes2.default.userRoutes);
app.use('/api/v1/recipes', _routes2.default.recipesRoutes);
app.use('/api/v1/frontend', _routes2.default.frontendRouter);
//  app.use((req, res) => res.render('index'));

app.get('*', function (req, res) {
  res.sendFile(_path2.default.resolve(__dirname, 'public', 'index.html'));
});

_models2.default.sequelize.sync().then(function () {
  app.listen(port, function () {
    //  console.log(process.env.NODE_ENV);
  });
});

exports.default = app;