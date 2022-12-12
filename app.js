const express = require('express');
const {getCategories, getReviews} = require('./controllers/controller.games');
const {handle404Errors} = require('./controllers/controller.errors')

const app = express();

app.get('/api/reviews', getReviews);
app.get('/api/categories', getCategories);

app.all('*', handle404Errors);

module.exports = app;