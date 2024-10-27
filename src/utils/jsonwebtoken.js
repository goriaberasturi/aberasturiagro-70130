import jwt from 'jsonwebtoken';
import { config } from './../config/index.js';

const generateToken = user => jwt.sign(user, config.private_key, { expiresIn: '1h' });

export { generateToken };