const {selectReviews,selectCategories,selectReviewID, selectComments, insertComments, updateVotes, selectUsers, removeComments} = require('../models/model');

exports.getReviews = (req, res, next) => {
    const { category, sort_by, order } = req.query
    selectReviews(category, sort_by, order)
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

exports.postComments = (req, res, next) => {
    const ID = req.params.review_id;
    const newComment = req.body;

    insertComments(newComment, ID)
    .then((comments) => {
        res.status(201).send({comments})
    })
    .catch((err) => {
        next(err)
    })
};

exports.patchVotes = (req, res, next) => {
    const ID = req.params.review_id;
    const newVotes = req.body;

    updateVotes(newVotes, ID)
    .then((review) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err)
    })
};

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
            next(err)
        })
};

exports.deleteComments = (req, res, next) => {
    const ID = req.params.comment_id;
    removeComments(ID).then(() => {
      res.sendStatus(204)
    })
   .catch((err) => {
            next(err)
        })
  };