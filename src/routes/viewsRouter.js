import { Router } from "express";
import { passportCall } from "../utils/passport/passportCall.js";
import { ViewsControllers } from "./../controllers/views.controller.js";
import { adminAutho, softJwt } from "./../middleware/auth.middleware.js";

const router = Router();
const {
    home,
    products,
    realTimeProducts,
    cart,
    login,
    register,
    editProducts
} = new ViewsControllers();

router.get('/', home);
router.get('/products', softJwt, products);
router.get('/realTimeProducts', passportCall('jwt'), adminAutho, realTimeProducts);
router.get('/realTimeProducts/:pid', passportCall('jwt'), adminAutho, editProducts);
router.get('/cart/:cid', passportCall('jwt'), cart);
router.get('/login', login);
router.get('/register', register);

export default router;