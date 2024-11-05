import { Router } from 'express';
import { ProductsController } from './../../controllers/products.controller.js';
import { passportCall } from './../../utils/passport/passportCall.js';
import { adminAutho } from './../../middleware/auth.middleware.js';

const router = Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductsController();

router.get('/', passportCall('jwt'), getProducts);
router.get('/:pid', passportCall('jwt'), getProduct);
router.post('/', passportCall('jwt'), adminAutho, createProduct);
router.put('/:pid', passportCall('jwt'), adminAutho, updateProduct);
router.delete('/:pid', passportCall('jwt'), adminAutho, deleteProduct);

export default router;