const express = require('express');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes');
const config = require('./config');

const app = express();

// Automatically sets view engine and adds dot notation to app.render
app.use(require('express-edge'));
app.set('views', `${__dirname}/views`);

// registering body-parser middleware with express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

mongoose.connect(config.MONGODB_URI);

if (!module.parent) {
    app.listen(config.PORT);
}

module.exports = app;