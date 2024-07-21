document.addEventListener("DOMContentLoaded", event => {
  const form = document.getElementById("roleForm");

  if (!form) {
    console.error("Formulario no encontrado");
    return;
  }

  const uid = form.getAttribute("data-uid");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Formulario enviado");
    console.log("UID:", uid);

    const url = `/api/users/premium/${uid}`;

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error("Error:", data.error);
          Toastify({
            text: `Error: ${data.error}`,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
          }).showToast();
        } else {
          console.log("Success:", data);
          Toastify({
            text: "Rol actualizado con éxito",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          }).showToast();
        }
      })
      .catch(error => {
        console.error("Error:", error);
        Toastify({
          text: `Error: ${error.message}`,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
        }).showToast();
      });
  });
});
