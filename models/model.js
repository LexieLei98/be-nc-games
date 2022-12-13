const db = require('../db/connection');

exports.selectReviews = (req, res) => {
    return db.query(`
    SELECT reviews.*, COUNT(comment_id) AS comment_count
    FROM comments
    RIGHT OUTER JOIN reviews
    ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`)
    .then((results) => {
        return results.rows;
    })
}

exports.selectCategories = (req, res) => {
    return db.query(`SELECT * FROM categories`)
    .then((results) => {
        return results.rows;
    })
}

exports.selectReviewID = (ID) => {
    return db.query(`
    SELECT * FROM reviews
    WHERE review_id = $1`, [ID])
    .then((results) => {
        if(results.rowCount === 0) {
            return Promise.reject({status: 404, msg:'NOT FOUND!'})
        }
        return results.rows[0];
    })
}

exports.selectComments = (ID) => {
    return db.query(`
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;`, [ID])
    .then((results) => {
        return results.rows;
    })
}
