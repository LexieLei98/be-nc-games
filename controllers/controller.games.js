const {selectReviews,selectCategories,selectReviewID, selectComments} = require('../models/model');

exports.getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
            next(err)
        })
};

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err)
    })
};

exports.getReviewID = (req, res, next) => {
    const ID = req.params.review_id;
    selectReviewID(ID)
    .then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
};

exports.getComments = (req, res, next) => {
    const ID = req.params.review_id;
    const promises = [selectComments(ID),selectReviewID(ID)]

    Promise.all(promises)
        .then(([comments]) => {
            res.status(200).send({comments})
        })
    .catch((err) => {
        next(err)
    })
};