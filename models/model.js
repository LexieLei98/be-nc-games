const db = require('../db/connection');
const comments = require('../db/data/test-data/comments');

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

exports.insertComments = (newComment, ID) => {
    const {username, body} = newComment;
    return db.query(`
    INSERT INTO comments
    (body, review_id, author)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,[body, ID, username])
    .then((results) => {
        return results.rows[0]
    })
}

exports.updateVotes = (newVotes, ID) => {
    const { inc_votes } = newVotes;
    return db.query(`
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING*;`, [inc_votes, ID])
    .then((results) => {
        if(results.rowCount === 0) {
            return Promise.reject({status: 404, msg:'NOT FOUND!'})
        }
        return results.rows[0]
    })
};

exports.selectUsers = (req, res) => {
    return db.query(`SELECT * FROM users`)
    .then((results) => {
        return results.rows;
    })
}