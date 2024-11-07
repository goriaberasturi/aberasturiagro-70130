import cartModel from "../daos/MongoDb/models/carts.model.js";
import { ticketService } from "./../services/index.js";

class TicketsController {
    constructor() {
        this.tService = ticketService;
    }

    getTickets = async (req, res) => {
        try {
            const tickets = await this.tService.getTickets();

            return res.status(200).send({ status: 'success', payload: tickets });
        } catch (error) {
            console.log(error);
        }
    };

    getTicket = async (req, res) => {
        try {
            const { tid } = req.params;
            const ticket = await this.tService.getTicket({ _id: tid });

            return res.status(200).send({ status: 'success', payload: ticket });
        } catch (error) {
            console.log(error);
        }
    };

    createTicket = async (req, res) => {
        try {
            const { body } = req;

            const response = await this.tService.createTicket(body);

            return res.status(200).send({ status: 'success', payload: body });
        } catch (error) {
            console.log(error);
        }
    };

    updateTicket = async (req, res) => {
        try {
            const { body } = req;
            const { tid } = req.params;

            const response = await this.tService.updateTicket({_id: tid}, body);

            return res.status(200).send({status: 'success', payload: response});
        } catch (error) {
            console.log(error);
        }
    };

    deleteTicket = async (req, res) => {
        try {
            const { tid } = req.params;

            const response = await this.tService.deleteTicket({_id: tid});
            if(!response) return res.status(404).send({status: 'error', message: 'No se hallo un ticket con este id'});

            res.status(200).send({status: 'success', payload: response});
        } catch (error) {
            console.log(error);
        }
    };
}

export { TicketsController };