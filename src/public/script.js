async function agregarProducto() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;

  const producto = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  };
  // Lógica para agregar un nuevo producto
  try {
    const response = await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    // Verificar si la solicitud fue exitosa
    if (response.ok) {
      cargarProductosEnElDom();
    } else {
      alert("no pudimos cargar tu producto, llena bien los campos");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud POST:", error);
  }
}

async function actualizarProducto() {
  console.log("actualizar producto");

  const id = document.getElementById("productIdToUpdate").value || undefined;
  const title = document.getElementById("updatedTitle").value || undefined;
  const description = document.getElementById("updatedDescription").value || undefined;
  const price = document.getElementById("updatedPrice").value || undefined;
  const thumbnail = document.getElementById("updatedThumbnail").value || undefined;
  const code = document.getElementById("updatedCode").value || undefined;
  const stock = document.getElementById("updatedStock").value || undefined;

  if (!id) {
    alert("Necesitas llenar el campo ID");
  }

  const product = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  };

  const body = {
    product: product,
    id: id,
  };

  // Lógica para agregar un nuevo product
  try {
    const response = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Verificar si la solicitud fue exitosa
    if (response.ok) {
      cargarProductosEnElDom();
    } else {
      alert("no pudimos actualizar tu producto");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud PUT:", error);
  }
}

async function borrarProducto(id) {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificar si la solicitud fue exitosa
    if (response.ok) {
      cargarProductosEnElDom();
    } else {
      alert("no pudimos borrar tu producto");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud PUT:", error);
  }
}

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
    console.error("Error al realizar la solicitud PUT:", error);
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
            <button onclick="borrarProducto(${producto.id})">Eliminar producto via DELETE</button>
          </div>
        </div>
      `;
      })
      .join("");
  }
}
cargarProductosEnElDom();
const submitButton = document.getElementById("add");
submitButton.addEventListener("click", agregarProducto);

const updateButton = document.getElementById("update");
updateButton.addEventListener("click", actualizarProducto);
