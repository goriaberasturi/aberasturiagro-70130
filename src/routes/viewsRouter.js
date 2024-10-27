import { Router } from "express";
import { productService, cartService } from "../services/index.js";
import { passportCall } from "../utils/passport/passportCall.js";
import { ViewsControllers } from "./../controllers/views.controller.js";

const router = Router();
const {
    home,
    products,
    realTimeProducts,
    cart,
    login,
    register
} = new ViewsControllers();

router.get('/', home);
router.get('/products', products);
router.get('/realTimeProducts', passportCall('jwt'), realTimeProducts);
router.get('/cart/:cid', passportCall('jwt'), cart);
router.get('/login', login);
router.get('/register', register);

export default router;