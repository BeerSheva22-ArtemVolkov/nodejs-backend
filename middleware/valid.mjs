const valid = (req, res, next) => {
    if (!req.body){
        throw `no body exists`;
    }
    if (!req.validated){
        throw `must be validated`;
    }
    if (req.joiError){
        throw req.joiError;
    }
    res.status(200);
    next();
}

export default valid;