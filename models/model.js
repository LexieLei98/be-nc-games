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