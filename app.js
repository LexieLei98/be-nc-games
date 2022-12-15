const express = require('express');
const {getCategories, getReviews, getReviewID, getComments, postComments, patchVotes, getUsers} = require('./controllers/controller.games');
const {handle404Errors, handleOtherErrors, handle500Errors} = require('./error_handling')

const app = express();
app.use(express.json());

app.get('/api/reviews', getReviews);
app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewID)
app.get('/api/reviews/:review_id/comments', getComments)

app.post('/api/reviews/:review_id/comments', postComments)
app.patch('/api/reviews/:review_id',patchVotes)
app.get('/api/users', getUsers)



app.use(handleOtherErrors);
app.use(handle500Errors);
app.all('*', handle404Errors);

module.exports = app;