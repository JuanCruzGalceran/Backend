import ProductManager from "../dao/Mongo/productManagerMongo.js";
import  __dirname  from "../utils.js";
const products = new ProductManager(__dirname+'/data/productos.json')
import { loggerDev } from "../config/logger.js";

const socketProducts = (socketServer) => {
    socketServer.on("connection",async(socket)=>{
        loggerDev.info("client connected con ID:",socket.id)
        const listadeproductos=await products.getProducts()

        socketServer.emit("enviodeproducts",listadeproductos)

        socket.on("addProduct",async(obj)=>{
            await products.addProduct(obj)
            const listadeproductos=await products.getProducts()
            socketServer.emit("enviodeproducts",listadeproductos)
            })

            socket.on("deleteProduct",async(id)=>{
                await products.deleteProduct(id) 
                const listadeproductos=await products.getProducts()
                socketServer.emit("enviodeproducts",listadeproductos)
                })
    })
};

export default socketProducts;