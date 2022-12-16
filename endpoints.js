const fs = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    fs.readFile(`${__dirname}/endpoints.json`, "utf-8")
    .then((endpoints) => {
        res.status(200).send({endpoints: {endpoints}});
    })
}


