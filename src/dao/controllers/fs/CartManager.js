import { promises as fs } from 'fs';
// const { join } = require('path');
// let rutaCarts = join(__dirname, '..', 'data', 'carts.json');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = [];
        this.loadCarts().then((data) => {
            this.carts = data;
        }).catch((error) => {
            console.error(`Error loading carts: ${error.message}`);
        });
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveCarts() {
        const data = JSON.stringify(this.carts, null, 2);
        await fs.writeFile(this.path, data);
    }

    generateCartId() {
        return this.carts.length > 0 ? Math.max(...this.carts.map(cart => cart.id)) + 1 : 1;
    }

    async addCart(newCart) {
        if (newCart.id) {
            throw new Error("No se puede especificar manualmente el campo 'id'");
        }
    
        const cart = {
            id: this.generateCartId(),
            products: []
        };
    
        this.carts.push(cart);
        await this.saveCarts();
    }

    async getCartById(id) {
        const cart = this.carts.find(cart => cart.id == id);
        if (!cart) {
            throw new Error(`No existe el carrito con el id ${id}`);
        }
        return cart;
    }

    async getAllCarts() {
        return this.carts;
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find(cart => cart.id == cartId);
        if (!cart) {
            throw new Error(`No existe el carrito con el id ${cartId}`);
        }

        const existingProduct = cart.products.find(product => product.id === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }

        await this.saveCarts();
    }
}

export default CartManager;


// const carts = new CartManager(rutaCarts);
// const addNewCart = async () => {
//     await carts.addCart();
// };
// addNewCart()
//     .then(() => {
//         console.log('Nuevo carrito creado correctamente');
//     })
//     .catch((error) => {
//         console.error(`Error al crear el nuevo carrito: ${error.message}`);
//     });