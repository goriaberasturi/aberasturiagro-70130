import { userService, cartService } from './../services/index.js';
import { createHash } from './../utils/bcrypt.js';

class UsersController {
    constructor() {
        this.uService = userService;
        this.cService = cartService;
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.uService.getUsers();
            res.send({ status: 'success', payload: users });
        } catch (error) {
            console.log(error);
        }
    };

    getUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await this.uService.getUser({ _id: uid });
            res.send({ status: 'success', payload: user });
        } catch (error) {
            console.log(error);
        }
    };

    createUser = async (req, res) => {
        try {
            const { first_name, last_name, email, password, birthday } = req.body;
            if (!email || !password || !birthday) return res.send({ status: 'error', error: 'Faltan llenar campos' });

            const userFound = await this.uService.getUser({ email });
            if (userFound) return res.status(401).send({ status: 'error', error: 'El email ya se encuentra registrado' });

            const userCart = await this.cService.createCart();

            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                birthday,
                cart: userCart._id
            }
            const result = await this.uService.createUser(newUser);

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
            console.log(req.body)

            const userToUpdate = {
                first_name,
                last_name,
                email
            }

            const result = await this.uService.updateUser({ _id: uid }, userToUpdate);

            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
        }
    };

    deleteUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const result = await this.uService.deleteUser({ _id: uid });

            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.log(error);
        }
    };
};

export { UsersController };