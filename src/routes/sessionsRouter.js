import { Router } from "express";
import authMiddleware from './../middleware/auth.middleware.js'
import UserManager from "./../daos/MongoDb/users.mongo.js";

const router = Router();
const userService = new UserManager();

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send({status: 'error', err});
    });
    res.send('logout');
});

router.post('/register', async (req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        if(!first_name || !last_name || !email || !password) return res.send({status: 'error', error: 'Faltan llenar campos'});

        const userFound = await userService.getUser({email});
        if(userFound) return res.status(401).send({status: 'error', error: 'El email ya se encuentra registrado'});

        const newUser = {first_name, last_name, email, password}
        const result = await userService.createUser(newUser);

        req.session.user = {
            email,
            isAdmin: newUser.role == 'admin'
        }

        res.redirect('/products');
    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).send({status: 'error', error: 'Ingrese email y contraseña'});

    const userFound = await userService.getUser({email});
    if(!userFound) return res.send({status: 'error', error: 'El usuario no se encuentra registrado'});

    if(userFound.email !== email || userFound.password !== password) {
        return res.send({status: 'error', error: 'El mail o la contraseña no coinciden'});
    }

    req.session.user = {
        email,
        isAdmin: userFound.role == 'admin'
    }

    res.redirect('/products');
})

export default router;