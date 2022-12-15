exports.handle404Errors = (req, res, next) => {
    res.status(404).send({msg: 'NOT FOUND!'});
};

exports.handleOtherErrors = (err, req, res, next) => {
    if(err.code === '22P02'|| err.code === '23502'){
        res.status(400).send({msg:'BAD REQUEST!'})
    }
    else if (err.code === '23503'){
        res.status(404).send({msg: 'NOT FOUND!'});
    }
    if (err.msg && err.status) {
        res.status(err.status).send({msg: err.msg});
    } 
    else {
        next(err);
    }
};

exports.handle500Errors = (err, req, res, next) => {
    res.status(500).send({msg: 'INTERNAL SERVER ERROR!'})
};