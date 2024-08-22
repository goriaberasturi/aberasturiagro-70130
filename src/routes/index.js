import { Router } from "express";
import productsRouter from './api/productsRouter.js';
import cartsRouter from './api/cartsRouter.js';
import viewsRouter from './viewsRouter.js';

const router = Router();

router.use('/', viewsRouter);
router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);

export default router;