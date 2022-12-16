const db = require('../db/connection');
const comments = require('../db/data/test-data/comments');

exports.selectReviews = (category, sort_by = 'created_at', order = 'DESC',) => {

    const vaildCategoryQueries = ['euro game', 'dexterity', 'social deduction', "children''s games"]
    const vaildSortByQueries = ['created_at', 'category', 'title', 'designer', 'owner', 'review_img_url', 'review_body', 'votes'];
    const vaildOrderQueries = ['ASC', 'DESC'];

    
    if(!vaildSortByQueries.includes(sort_by) || !vaildOrderQueries.includes(order)){
        return Promise.reject({status: 400, msg:'BAD REQUEST'})
    }

    const queryValues = []
    let queryString = `
    SELECT reviews.*, COUNT(comment_id) AS comment_count
    FROM comments
    RIGHT OUTER JOIN reviews
    ON comments.review_id = reviews.review_id `

    if(category !== undefined && !vaildCategoryQueries.includes(category)){
        return Promise.reject({status: 404, msg:'NOT FOUND'})
    }else if(category !== undefined && vaildCategoryQueries.includes(category)){
        queryString += `WHERE category = $1 `
        queryValues.push(category)
    }
    
    queryString += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`

    return db.query(queryString, queryValues)
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
    SELECT reviews.*,COUNT (comments.review_id) AS comment_count
    FROM comments
    RIGHT OUTER JOIN reviews
    ON comments.review_id = reviews.review_id 
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
    ;`, [ID])
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

exports.removeComments  = (ID) => {
    return db.query(`
    DELETE FROM comments 
    WHERE comment_id = $1;`,[ID])
    .then((result) => {
        if(result.rowCount === 0) {
            return Promise.reject({status: 404, msg:'NOT FOUND!'})
        }
        return result.rows[0]
    })
};