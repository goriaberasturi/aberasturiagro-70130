import {Router} from 'express';
import UserManager from './../../daos/MongoDb/users.mongo.js';
import authMdlwr from './../../middleware/auth.middleware.js'

const router = Router();
const userService = new UserManager();

const midd1 = (req, res, next) => {
    console.log('middleware');
    next();
};

// Traer todos los usuarios
router.get('/', authMdlwr, async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.send({status: 'success', payload: users});
    } catch (error) {
        console.log(error);
    }
});

router.get('/:uid', async (req, res) => {
    try {
        const {uid} = req.params;
        const user = await userService.getUser({_id: uid});
        res.send({status: 'success', payload: user});
    } catch (error) {
        
    }
});

router.put('/:uid', async (req, res) => {
    try {
        const {first_name, last_name, email} = req.body;
        
        if(!email) return res.send({status: 'error', error: 'Faltan llenar campos'});
        
        const userToUpdate = {
            first_name,
            last_name,
            email,
            password
        }
        
        const result = 'Construir';

        res.send({status: 'success', payload: result});
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:uid', async (req, res) => {
    try {
        const {uid} = req.params;
        const result = 'Construir';

        res.send({status: 'success', payload: result});
    } catch (error) {
        console.log(error);
    }
});

export default router;