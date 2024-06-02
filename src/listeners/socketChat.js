import MessageManager from "../dao/Mongo/messageManagerMongo.js";
import { loggerDev } from "../config/logger.js";

const messageManager = new MessageManager();

const socketChat = socketServer => {
  socketServer.on("connection", async socket => {
    loggerDev.info("conectado usuario con id: " + socket.id);

    socket.on("mensaje", async info => {
      await messageManager.createMessage(info);
      socketServer.emit("chat", await messageManager.getMessages());
    });

    socket.on("clearchat", async () => {
      await messageManager.deleteAllMessages();
      socketServer.emit("chat", await messageManager.getMessages());
    });

    socket.on("nuevousuario", usuario => {
      socket.broadcast.emit("broadcast", usuario);
    });
  });
};

export default socketChat;
