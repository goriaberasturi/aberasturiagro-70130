import { Router } from "express";
import { CartsController } from "../../controllers/carts.controller.js";

const router = Router();
const {
    getCarts,
    addProduct,
    updateOnCart,
    emptyCart,
    deleteFromCart
} = new CartsController();

router.get('/', getCarts);
router.put('/:cid', addProduct);
router.put('/:cid/products/:pid', updateOnCart);
router.delete('/:cid', emptyCart);
router.delete('/:cid/products/:pid', deleteFromCart);

export default router;