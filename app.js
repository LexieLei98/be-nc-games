const express = require('express');
const {getReviews} = require('./controllers/controller.games');
const {handle404Errors} = require('./controllers/controller.errors')

const app = express();

app.get('/api/reviews', getReviews);

app.all('*', handle404Errors);

module.exports = app;