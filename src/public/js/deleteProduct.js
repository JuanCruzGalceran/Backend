async function deleteProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("No se pudo eliminar el producto");
    }

    const data = await response.json();
    Toastify({
      text: "Producto Eliminado",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();
    setTimeout(function () {
      window.location.href = "/premium";
    }, 1500);
  } catch (error) {
    Toastify({
      text: `Error: ${error.message}`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
    }).showToast();
  }
}
