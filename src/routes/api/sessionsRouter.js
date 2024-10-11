import { Router } from "express";
import UserManager from "../../daos/MongoDb/users.mongo.js";
import CartsManagerMongo from "../../daos/MongoDb/carts.manager.mongo.js";
import { createHash, isValidPassword } from './../../utils/bcrypt.js';
import { generateToken } from "../../utils/jsonwebtoken.js";
import { passportCall } from "../../utils/passport/passportCall.js";

const router = Router();
const userService = new UserManager();
const cartService = new CartsManagerMongo();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, birthday } = req.body;
        if (!email || !password || !birthday) return res.send({ status: 'error', error: 'Faltan llenar campos' });

        const userFound = await userService.getUser({ email });
        if (userFound) return res.status(401).send({ status: 'error', error: 'El email ya se encuentra registrado' });

        const userCart = await cartService.createCart();

        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            birthday,
            cart: userCart._id
        }
        const result = await userService.createUser(newUser);

        res.redirect('/products');
    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: 'error', error: 'Ingrese email y contraseña' });

        const userFound = await userService.getUser({ email });
        if (!userFound) return res.send({ status: 'error', error: 'El usuario no se encuentra registrado' });

        if (userFound.email !== email || !isValidPassword(password, userFound.password)) {
            return res.send({ status: 'error', error: 'El mail o la contraseña no coinciden' });
        }

        const token = generateToken({ id: userFound._id, cart: userFound.cart, role: userFound.role });

        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        }).redirect('/products');

    } catch (error) {
        console.log(error);
    }
})

router.get('/current', passportCall('jwt'), (req, res) => {
    res.send({userData: req.user});
});

export default router;