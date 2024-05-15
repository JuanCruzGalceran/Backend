class ProductRepository {
  constructor(productManager) {
    this.productManager = productManager;
  }

  getProducts = () => {
    return this.productManager.getProducts();
  };

  addProduct = product => {
    return this.productManager.addProduct(product);
  };

  updateProduct = (id, updatedProduct) => {
    return this.productManager.updateProduct(id, updatedProduct);
  };

  deleteProduct = id => {
    return this.productManager.deleteProduct(id);
  };

  getProductById = id => {
    return this.productManager.getProductById(id);
  };

  getProductsFiltered = (category = null) => {
    return this.productManager.getProductsFiltered(category);
  };
}

export default ProductRepository;
