exports.handle404Errors = (req, res, next) => {
    res.status(404).send({message: 'SORRY NO SUCH PATH ;('});
};

exports.handleOtherErrors = (err, req, res, next) => {
    if (err.status && err.status){
        res.status(err.status).send({message: err.message});
    }
    else {next(err)}
};

exports.handle500Errors = (err, req, res, next) => {
    res.status(500).send({message: 'INTERNAL SERVER ERROR!'})
};