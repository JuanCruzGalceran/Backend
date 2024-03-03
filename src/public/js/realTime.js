const socketClient=io()

socketClient.on("enviodeproducts",(obj)=>{
    updateProductList(obj)
})


function updateProductList(productList) {
 
    const productsDiv  = document.getElementById('list-products')

    let productosHTML = "";
  
    productList.forEach((product) => {
      const thumbnailUrl = product.thumbnails.length > 0 ? product.thumbnails[0].url : 'https://img.freepik.com/vector-gratis/ilustracion-icono-galeria_53876-27002.jpg';
        productosHTML += `
          <div class="card">
            <div class="card-header-code">code: ${product.code}</div>
              <div class="card-body">
                  <h4 class="card-title">${product.title}</h4>
                    <ul class="card-text">
                      <li>Id: ${product.id}</li>
                      <li>Description: ${product.description}</li>
                      <li>Price: $${product.price}</li>
                      <li>Category: ${product.category}</li>
                      <li>Status: ${product.status}</li>
                      <li>Stock: ${product.stock}</li>
                    </ul>
                    <div class="img-container">
                      <img class="card-img" src="${thumbnailUrl}" alt="${product.title}">
                    </div>
              </div>
              <div class="container-eliminar-btn">
                <button type="button" class="eliminar-btn" onclick="deleteProduct(${product.id})"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
`;
    });
  
    productsDiv .innerHTML = productosHTML;
  }


  let form = document.getElementById("formProduct");
  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
  
    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnailInput = form.elements.thumbnail.value;
    let thumbnails = thumbnailInput.split(',').map(url => ({ url: url.trim() }));
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    let status = form.elements.status.checked;
  
    socketClient.emit("addProduct", {
      title,
      description,
      stock,
      thumbnails,
      category,
      price,
      code,
      status,
    });
  
    form.reset();
  });


document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = parseInt(deleteidinput.value);
    socketClient.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  })

function deleteProduct(productId) {
  socketClient.emit("deleteProduct", productId);
}