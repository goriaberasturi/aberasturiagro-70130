class TicketsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getTickets = async () => await this.dao.get();
    getTicket = async filter => await this.dao.getBy(filter);
    createTicket = async newTicket => await this.dao.create(newTicket);
    updateTicket = async (filter, updatedProduct) => await this.dao.update(filter, updatedProduct);
    deleteTicket = async filter => await this.dao.delete(filter);
}

export { TicketsRepository };