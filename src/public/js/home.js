function agregarAlCarrito(productoId) {

    fetch('http://localhost:8080/api/carts/6609e46da549210a33b04145/product/' + productoId + '/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            Toastify({
                text: 'Producto agregado al carrito correctamente',
                duration: 3000,
                className: "toast",
                style: {
                    background: "linear-gradient(to right, #93e77e, #38943b)",
                    color: "#000000",
                },
                close: true
            }).showToast();
        } else {
            Toastify({
                text: 'Hubo un error al agregar el producto al carrito',
                duration: 3000,
                className: "toast",
                style: {
                    background: "linear-gradient(to right, #e36f6f, #c42626)",
                    color: "#000000",
                },
                close: true
            }).showToast();
        }
    })
    .catch(error => {
        console.error('Error al agregar producto al carrito:', error);
        Toastify({
            text: 'Hubo un error al agregar el producto al carrito',
            duration: 3000,
            className: "toast",
            style: {
                background: "linear-gradient(to right, #e36f6f, #c42626)",
                color: "#000000",
            },
            close: true
        }).showToast();
    });
}


