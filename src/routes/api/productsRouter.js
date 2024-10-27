import {Router} from 'express';
import { ProductsController } from './../../controllers/products.controller.js';

const router = Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductsController();

router.get('/', getProducts);
router.get('/:pid', getProduct);
router.post('/', createProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;