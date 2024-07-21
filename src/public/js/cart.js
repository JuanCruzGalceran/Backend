function finishPurchase(cartId) {
  const PUERTO = window.location.port || 8080;

  fetch(`http://localhost:${PUERTO}/api/carts/${cartId}/purchase/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(response => response.json())
    .then(result => {
      console.log("debugJ", result);
      if (result.newTicket) {
        Toastify({
          text: "Compra finalizada correctamente",
          duration: 3000,
          className: "toast",
          style: {
            background: "linear-gradient(to right, #93e77e, #38943b)",
            color: "#000000",
          },
          close: true,
        }).showToast();
        window.location.href = `/details?ticketId=${result.newTicket._id}`;

        if (result.unavailableProducts && result.unavailableProducts.length > 0) {
          const message = result.unavailableProducts
            .map(item => `No se pudo comprar ${item.quantity} de ${item.product.title}. Cantidad comprada: ${item.product.stock}`)
            .join("\n");

          Toastify({
            text: message,
            duration: 5000,
            className: "toast",
            style: {
              background: "linear-gradient(to right, #e36f6f, #c42626)",
              color: "#000000",
            },
            close: true,
          }).showToast();
        }
      } else {
        Toastify({
          text: result.message || "Hubo un error al comprar",
          duration: 3000,
          className: "toast",
          style: {
            background: "linear-gradient(to right, #e36f6f, #c42626)",
            color: "#000000",
          },
          close: true,
        }).showToast();
      }
    })
    .catch(error => {
      console.log("debugJ error", error);
      Toastify({
        text: "Error al comprar",
        duration: 3000,
        className: "toast",
        style: {
          background: "linear-gradient(to right, #e36f6f, #c42626)",
          color: "#000000",
        },
        close: true,
      }).showToast();
    });
}
