import { promises as fs } from 'fs';

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts().then((data) => {
            this.products = data;
        }).catch((error) => {
            console.error(`Error loading products: ${error.message}`);
        });
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        await fs.writeFile(this.path, data);
    }

    generateId() {
        return this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
    }

    async addProduct(newProduct) {
        if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.code || !newProduct.stock) {
            throw new Error("Faltan datos");
        }

        let repetido = this.products.find(product => product.code === newProduct.code);
        if (repetido) {
            throw new Error(`El código ${newProduct.code} ya existe`);
        }
        if (isNaN(Number(newProduct.code))) {
            throw new Error(`El código debe ser un número`);
        }

        const product = {
            id: this.generateId(),
            title: newProduct.title,
            description: newProduct.description,
            code: newProduct.code,
            price: newProduct.price,
            status: true, 
            stock: newProduct.stock,
            category: newProduct.category || "",  
            thumbnails: newProduct.thumbnails || []
        };

        this.products.push(product);
        await this.saveProducts();
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error(`No existe el producto con el id ${id}`);
        }
        return product;
    }

    async updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error(`No existe el producto con el id ${id}`);
        }
    
        if (updatedProduct.id && updatedProduct.id !== id) {
            throw new Error(`No se puede modificar el campo 'id'`);
        }
    
        this.products[index] = { ...this.products[index], ...updatedProduct };
        await this.saveProducts();
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new Error(`No existe el producto con el id ${id}`);
        }

        this.products.splice(index, 1);
        await this.saveProducts();
    }
}

export default ProductManager;

// ************************************
// products.addProduct({
//     title: "Zapatilla 02",
//     description: "Esta es la zapatilla 02",
//     price: 210,
//     thumbnail: "Sin imagen",
//     code: "2",
//     stock: 25
// });

// console.log(products.getProducts());
// console.log(products.getProductById(3));

// products.updateProduct(3, { price: 20, stock: 150 });
// console.log(products.getProducts());

// products.deleteProduct(7);
// console.log(products.getProducts());






