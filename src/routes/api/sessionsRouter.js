import { Router } from "express";
import { passportCall } from "../../utils/passport/passportCall.js";
import { SessionsController } from "./../../controllers/sessions.controller.js";

const router = Router();
const {
    logout,
    login,
    current
} = new SessionsController();

router.get('/logout', passportCall('jwt'), logout);
router.post('/login', login);
router.get('/current', passportCall('jwt'), current);

export default router;