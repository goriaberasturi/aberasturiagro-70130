import passport from 'passport';
import jwt from 'passport-jwt';
import { config } from './index.js';

const JwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const initializePassport = () => {
    const cookieExtractor = req => {
        let token = null;

        if (req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    }

    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.private_key
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));
}

export { initializePassport };