import { Router } from "express";
import { TicketsController } from "./../../controllers/tickets.controller.js";
import { passportCall } from './../../utils/passport/passportCall.js';

const router = Router();
const {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket
} = new TicketsController()

router.get('/', getTickets);
router.get('/:tid', getTicket);
router.post('/', passportCall('jwt'), createTicket);
router.put('/:tid', updateTicket);
router.delete('/:tid', deleteTicket);

export default router;