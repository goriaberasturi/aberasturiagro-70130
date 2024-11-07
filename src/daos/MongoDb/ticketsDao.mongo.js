import ticketModel from './models/tickets.model.js';

class TicketsDaoMongo {
    constructor() {
        this.model = ticketModel;
    }

    get = async () => await this.model.find();
    getBy = async filter => await this.model.find(filter);
    create = async newTicket => await this.model.create(newTicket);
    update = async (filter, updatedTicket) => await this.model.findOneAndUpdate(filter, updatedTicket);
    delete = async filter => await this.model.findOneAndDelete(filter);
}

export default TicketsDaoMongo;