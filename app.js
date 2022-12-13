const express = require('express');
const {getCategories, getReviews, getReviewID, getComments} = require('./controllers/controller.games');
const {handle404Errors, handleOtherErrors, handle500Errors} = require('./error_handling')

const app = express();

app.get('/api/reviews', getReviews);
app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewID)
app.get('/api/reviews/:review_id/comments', getComments)


app.use(handleOtherErrors);
app.use(handle500Errors);
app.all('*', handle404Errors);

module.exports = app;