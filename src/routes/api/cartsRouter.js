import { Router } from "express";
import { CartsController } from "../../controllers/carts.controller.js";
import { userAutho, adminAutho } from "./../../middleware/auth.middleware.js";
import { passportCall} from './../../utils/passport/passportCall.js'

const router = Router();
const {
    getCarts,
    addProduct,
    updateOnCart,
    emptyCart,
    deleteFromCart
} = new CartsController();

router.get('/', adminAutho, getCarts);
router.post('/', passportCall('jwt'), userAutho, addProduct);
router.post('/purchase', passportCall('jwt'), userAutho, addProduct);
router.put('/products/:pid', passportCall('jwt'), userAutho, updateOnCart);
router.delete('/:cid', emptyCart);
router.delete('/products/:pid', passportCall('jwt'), userAutho, deleteFromCart);

export default router;