import { Router } from "express";
import { passportCall } from "../../utils/passport/passportCall.js";
import { SessionsController } from "./../../controllers/sessions.controller.js";

const router = Router();
const {
    login,
    current
} = new SessionsController();

router.post('/login', login);
router.get('/current', passportCall('jwt'), current);

export default router;