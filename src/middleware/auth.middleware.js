import passport from "passport";

const adminAutho = (req, res, next) => {
    if (req.user.role === 'admin') return next();

    res.status(403).send({status: 'error', error:'Access denied. Only users with role "admin" are allowed'});
}

const userAutho = (req, res, next) => {
    if(req.user.role === 'user') return next();

    res.status(403).send({status: 'error', error:'Access denied. Only users with role "user" are allowed'});
}

const softJwt = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if(err) return next(err);
        if(user) req.user = user;
    })(req, res, next);
    next();
};

export { adminAutho, userAutho, softJwt };