class MessageRepository {
  constructor(MessageManager) {
    this.MessageManager = MessageManager;
  }

  getMessages = () => {
    return this.MessageManager.getMessages();
  };

  createMessage = messageData => {
    return this.MessageManager.createMessage(messageData);
  };

  deleteAllMessages = () => {
    return this.MessageManager.deleteAllMessages();
  };
}

export default MessageRepository;
