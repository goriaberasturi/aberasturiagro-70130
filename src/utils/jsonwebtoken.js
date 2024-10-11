import jwt from 'jsonwebtoken';

const PRIVATE_KEY = 'lT9nxCqqWIewEqHT7qjC9zLGW35fkS';

const generateToken = user => jwt.sign(user, PRIVATE_KEY, {expiresIn: '1h'});

export {generateToken, PRIVATE_KEY};