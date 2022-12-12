const db = require('../db/connection');

exports.selectCategories = (req, res) => {
    return db.query(`SELECT * FROM categories`)
    .then((results) => {
        return results.rows;
    })
}