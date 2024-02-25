async function cargarProductosEnElDom() {
  const container = document.getElementById("productos");

  try {
    const response = await fetch("http://localhost:8080/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      const tarjetas = generarTarjetasProductos(data.products);

      container.innerHTML = tarjetas;
    } else {
    }
  } catch (error) {
    console.error("Error al cargar productos en el dom", error);
  }
  function generarTarjetasProductos(productos) {
    return productos
      .map(producto => {
        return `
          <div class="card">
            <img src="${producto.thumbnail}" alt="${producto.title}" style="width:100%">
            <div class="container">
              <h2>${producto.title}</h2>
              <p>ID: ${producto.id}</p>
              <p>${producto.description}</p>
              <p>Precio: ${producto.price}</p>
              <p>Código: ${producto.code}</p>
              <p>Stock: ${producto.stock}</p>
              <button onclick="agregarProductoAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
          </div>
        `;
      })
      .join("");
  }
}

async function agregarNuevoCarrito() {
  try {
    const response = await fetch("http://localhost:8080/api/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Verificar si la solicitud fue exitosa
    if (response.ok) {
      return data.userCart.id;
    } else {
      alert("no pudimos cargar crear un nuevo carrito");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud POST:", error);
  }
}

async function agregarProductoAlCarrito(productId) {
  let userCartId = window.userCartId || undefined;

  if (!userCartId) {
    userCartId = await agregarNuevoCarrito();
    window.userCartId = userCartId;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/carts/${userCartId}/product/${productId},`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      await cargarCarritoEnElDom(userCartId);
    } else {
      alert("no pudimos cargar tu producto al carrito");
    }
  } catch (error) {
    console.error(error);
  }
}

async function cargarCarritoEnElDom(cartId) {
  const container = document.getElementById("carrito");

  try {
    const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      const carrito = generarCarrito(data.cart.products);
      container.innerHTML = carrito;
    } else {
      console.error("Error al cargar productos en el dom", error);
    }
  } catch (error) {
    console.error("Error al cargar productos en el dom", error);
  }
  function generarCarrito(productos) {
    return productos
      .map(producto => {
        return `
          <div class="card">
            <h1>Product ID: ${producto.id}</h1>
            <p>Quantity ${producto.quantity}</p>
          </div>
        `;
      })
      .join("");
  }
}

cargarProductosEnElDom();
