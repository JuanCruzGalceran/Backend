// Repository de Product
import ProductManager from "../dao/Mongo/productManagerMongo.js";
import ProductRepository from "./repository/ProductRepository.js";

const productManager = new ProductManager();
export const productRepository = new ProductRepository(productManager);

// Repository de Cart
import CartManager from "../dao/Mongo/cartManagerMongo.js";
import CartRepository from "./repository/CartRepository.js";

const cartManager = new CartManager();
export const cartRepository = new CartRepository(cartManager);

//Repository de Users
import UsersManager from "../dao/Mongo/userManagerMongo.js";
import UserRepository from "./repository/UsersRepository.js";

const UserManager = new UsersManager();
export const userRepository = new UserRepository(UserManager);

//Repository de tickets

// import TicketManager from "../dao/Mongo/ticketManagerMongo.js";
// import TicketRepository from "./repository/TicketRepository.js";

// const ticketManager = new TicketManager();
// export const ticketRepository = new TicketRepository(ticketManager);

//Repository de Mensajes
import MessageManager from "../dao/Mongo/messageManagerMongo.js";
import MessageRepository from "./repository/MessageRepository.js";

const messageManager = new MessageManager();
export const messageRepository = new MessageRepository(messageManager);
