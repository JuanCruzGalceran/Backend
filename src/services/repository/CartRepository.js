class CartRepository {
  constructor(cartManager) {
    this.cartManager = cartManager;
  }

  createCart = () => {
    return this.cartManager.createCart();
  };

  getAll = () => {
    return this.cartManager.getCarts();
  };

  getCartById = cartId => {
    return this.cartManager.getCartById(cartId);
  };

  addProductToCart = (cartId, productId, quantity) => {
    return this.cartManager.addProductToCart(cartId, productId, quantity);
  };

  deleteProductFromCart = (cartId, productId) => {
    return this.cartManager.deleteProductFromCart(cartId, productId);
  };

  updateCart = (cartId, updatedProducts) => {
    return this.cartManager.updateCart(cartId, updatedProducts);
  };

  updateProductQuantity = (cartId, productId, newQuantity) => {
    return this.cartManager.updateProductQuantity(cartId, productId, newQuantity);
  };

  emptyCart = cartId => {
    return this.cartManager.emptyCart(cartId);
  };
}

export default CartRepository;
