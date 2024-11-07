import { Router } from "express";
import viewsRouter from './viewsRouter.js';
import productsRouter from './api/productsRouter.js';
import cartsRouter from './api/cartsRouter.js';
import usersRouter from './api/usersRouter.js';
import sessionsRouter from './api/sessionsRouter.js';
import ticketsRouter from './api/ticketsRouter.js';

const router = Router();

router.use('/', viewsRouter);
router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);
router.use('/api/users', usersRouter);
router.use('/api/sessions', sessionsRouter);
router.use('/api/tickets', ticketsRouter);

export default router;