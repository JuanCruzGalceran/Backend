const fs = require("fs").promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts()
      .then(data => {
        this.products = data;
      })
      .catch(error => {
        console.error(`Error loading products: ${error.message}`);
      });
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf8");
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

    if (newProduct.id) {
      throw new Error("No puedes pasar un ID");
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
      thumbnails: newProduct.thumbnails || [],
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
    if (updatedProduct.id) {
      throw new Error("No se puede modificar el ID del producto");
    }

    const index = this.products.findIndex(product => product.id === parseInt(id));
    if (index === -1) {
      throw new Error(`No existe el producto con el id ${id}`);
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

module.exports = ProductManager;
