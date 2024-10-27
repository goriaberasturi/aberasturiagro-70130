import { userService, cartService } from './../services/index.js';
import { createHash } from './../utils/bcrypt.js';

class UsersController {
    constructor() {
        this.userService = userService;
        this.cartService = cartService;
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.userService.get();
            res.send({ status: 'success', payload: users });
        } catch (error) {
            console.log(error);
        }
    };

    getUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await this.userService.getBy({ _id: uid });
            res.send({ status: 'success', payload: user });
        } catch (error) {
            console.log(error);
        }
    };

    createUser = async (req, res) => {
        try {
            const { first_name, last_name, email, password, birthday } = req.body;
            if (!email || !password || !birthday) return res.send({ status: 'error', error: 'Faltan llenar campos' });
    
            const userFound = await userService.getBy({ email });
            if (userFound) return res.status(401).send({ status: 'error', error: 'El email ya se encuentra registrado' });
    
            const userCart = await this.cartService.create();
    
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                birthday,
                cart: userCart._id
            }
            const result = await userService.create(newUser);
    
            res.redirect('/products');
        } catch (error) {
            console.log(error);
        }
    };

    updateUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const { first_name, last_name, email } = req.body;

            if (!email) return res.send({ status: 'error', error: 'Faltan llenar campos' });

            const userToUpdate = {
                first_name,
                last_name,
                email,
                password
            }

            const result = await this.userService.update({ _id: uid, userToUpdate });

            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
        }
    };

    deleteUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const result = await this.userService.delete({ _id: uid });

            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
        }
    };
};

export { UsersController };