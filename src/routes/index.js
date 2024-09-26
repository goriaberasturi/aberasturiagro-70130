import { Router } from "express";
import viewsRouter from './viewsRouter.js';
import productsRouter from './api/productsRouter.js';
import cartsRouter from './api/cartsRouter.js';
import usersRouter from './api/usersRouter.js'
import sessionsRouter from './sessionsRouter.js'

const router = Router();

router.use('/', viewsRouter);
router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);
router.use('/api/users', usersRouter);
router.use('/sessions', sessionsRouter);

export default router;