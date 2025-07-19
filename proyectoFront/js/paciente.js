document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://iconiclinic-back.onrender.com/api";
  const id = localStorage.getItem("id_usuario");

  if (!id) {
    alert("Sesión expirada. Inicia sesión nuevamente.");
    window.location.href = "index.html";
    return;
  }

  fetch(`${BASE_URL}/paciente/rutina/${id}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("No se encontró rutina");

      const rutina = data.rutina;

      const diaCard = document.querySelector(".rutinas-cards-container .card:nth-child(1) ol");
      diaCard.innerHTML = rutina.dia?.descripcion
        .split("\n")
        .map(paso => `<li>${paso}</li>`)
        .join("");

      const nocheCard = document.querySelector(".rutinas-cards-container .card:nth-child(2) ol");
      nocheCard.innerHTML = rutina.noche?.descripcion
        .split("\n")
        .map(paso => `<li>${paso}</li>`)
        .join("");

      const consejoCard = document.querySelector(".rutinas-cards-container .card:nth-child(3) ol");
      consejoCard.innerHTML = rutina.consejos?.descripcion
        .split("\n")
        .map(c => `<li>${c}</li>`)
        .join("");

    })
    .catch(err => {
      console.error("Error cargando rutina:", err);
    });
});
