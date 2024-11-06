import { userService } from './../services/index.js';
import { isValidPassword } from './../utils/bcrypt.js';
import { generateToken } from './../utils/jsonwebtoken.js';

class SessionsController {
    constructor() {
        this.uService = userService;
    }

    static injectToken = async (tokenData, res) => {
        const token = generateToken(tokenData);

        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        }).redirect('/products');
    }

    login = async (req, res) => {
        try {
            console.log(req.user)
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).send({ status: 'error', error: 'Ingrese email y contraseña' });
    
            const userFound = await this.uService.getUser({ email });
            if (!userFound) return res.send({ status: 'error', error: 'El usuario no se encuentra registrado' });
    
            if (userFound.email !== email || !isValidPassword(password, userFound.password)) {
                return res.send({ status: 'error', error: 'El mail o la contraseña no coinciden' });
            }

            await SessionsController.injectToken({ id: userFound._id, cart: userFound.cart, role: userFound.role }, res);
    
        } catch (error) {
            console.log(error);
        }
    };

    current = async (req, res) => {
        try {
            res.send({userData: req.user});
        } catch (error) {
            console.log(error)
        }
    }
}

export { SessionsController };