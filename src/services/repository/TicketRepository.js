class TicketRepository {
  constructor(TicketManager) {
    this.TicketManager = TicketManager;
  }

  getAll = userId => {
    return this.TicketManager.getTicketsByUser(userId);
  };

  create = (userId, cartId) => {
    return this.TicketManager.createTicket(userId, cartId);
  };
}

export default TicketRepository;
