const authentication = (req, res, next) => {
    console.log(req.session);
    if(req.session && req.session.user && req.session.user.isAdmin) {
        return next();
    }
    res.status(403).send('Acceso denegado');
}

export default authentication;