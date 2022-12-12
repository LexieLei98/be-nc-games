exports.handle404Errors = (req, res, next) => {
    res.status(404).send({message: 'SORRY NO SUCH PATH ;('});
};

exports.handle500Errors = (err, req, res, next) => {
    res.status(500).send({message: 'INTERNAL SERVER ERROR!'})
};