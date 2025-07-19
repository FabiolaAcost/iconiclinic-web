document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://iconiclinic-back.onrender.com/api";
  const id = localStorage.getItem("id_usuario");

  console.log("ID obtenido desde localStorage:", id);

  if (!id) {
    alert("Sesión expirada. Inicia sesión nuevamente.");
    window.location.href = "index.html";
    return;
  }

  const endpoint = `${BASE_URL}/paciente/rutina/${id}`;
  console.log("Realizando fetch a:", endpoint);

  fetch(endpoint)
    .then(res => {
      console.log("Respuesta del backend:", res);
      return res.json();
    })
    .then(data => {
      console.log("Data recibida:", data);

      if (!data.success) throw new Error("No se encontró rutina");

      const rutina = data.rutina;

      const diaCard = document.getElementById("rutina-dia");
      const nocheCard = document.getElementById("rutina-noche");
      const consejoCard = document.getElementById("rutina-consejos");

      if (rutina.dia) {
        diaCard.innerHTML = rutina.dia.descripcion
          .split("\n")
          .map(paso => `<li>${paso}</li>`)
          .join("");
      }

      if (rutina.noche) {
        nocheCard.innerHTML = rutina.noche.descripcion
          .split("\n")
          .map(paso => `<li>${paso}</li>`)
          .join("");
      }

      if (rutina.consejos) {
        consejoCard.innerHTML = rutina.consejos.descripcion
          .split("\n")
          .map(c => `<li>${c}</li>`)
          .join("");
      }
    })
    .catch(err => {
      console.error("Error al cargar rutina:", err);
    });
});
