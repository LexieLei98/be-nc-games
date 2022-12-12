const express = require('express');
const {getCategories,} = require('./controllers/controller.games');
const {handle404Errors, handleOtherErrors, handle500Errors} = require('./controllers/controller.errors')

const app = express();

app.get('/api/categories', getCategories);

app.all('*', handle404Errors);

module.exports = app;