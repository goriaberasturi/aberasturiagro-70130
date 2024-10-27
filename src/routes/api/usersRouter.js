import { Router } from 'express';
import { passportCall } from './../../utils/passport/passportCall.js';
import { UsersController } from './../../controllers/users.controller.js';

const router = Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = new UsersController();

// Traer todos los usuarios
router.get('/', passportCall('jwt'), getUsers);
router.get('/:uid', getUser);
router.post('/', createUser);
router.put('/:uid', updateUser);
router.delete('/:uid', deleteUser);

export default router;