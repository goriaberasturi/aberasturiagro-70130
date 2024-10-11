import passport from 'passport';
import jwt from 'passport-jwt';
import { PRIVATE_KEY } from './../utils/jsonwebtoken.js'

const JwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    const cookieExtractor = req => {
        let token = null;

        if(req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    }

    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));
}

export {initializePassport};