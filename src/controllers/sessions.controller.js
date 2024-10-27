import { userService } from './../services/index.js';
import { isValidPassword } from './../utils/bcrypt.js';
import { generateToken } from './../utils/jsonwebtoken.js';

class SessionsController {
    constructor() {
        this.userService = userService;
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).send({ status: 'error', error: 'Ingrese email y contraseña' });
    
            const userFound = await this.userService.getBy({ email });
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
    };

    current = (req, res) => {
        res.send({userData: req.user});
    }
}

export { SessionsController };