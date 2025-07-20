document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://iconiclinic-web.onrender.com/api";
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

    const dividirPasos = (texto) => {
      if (!texto) return [];
      return texto
        .split(/(?=\d+\.\s?)/) 
        .map(p => p.trim())
        .filter(p => p !== "");
    };

    const limpiar = t => t.replace(/^\d+\.\s*/, ""); 

    document.getElementById("rutina-dia").innerHTML = dividirPasos(rutina.dia?.descripcion)
      .map(p => `<li>${limpiar(p)}</li>`).join("");

    document.getElementById("rutina-noche").innerHTML = dividirPasos(rutina.noche?.descripcion)
      .map(p => `<li>${limpiar(p)}</li>`).join("");

    document.getElementById("rutina-consejos").innerHTML = dividirPasos(rutina.consejos?.descripcion)
      .map(c => `<li>${limpiar(c)}</li>`).join("");
  })
  .catch(err => console.error("Error rutina:", err));


  fetch(`${BASE_URL}/paciente/historial/${id}`)
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("contenedor-historial");
    if (!data.success || data.historial.length === 0) {
      contenedor.innerHTML = "<p class='texto'>No hay tratamientos registrados.</p>";
      return;
    }

    contenedor.innerHTML = data.historial.map(t => {
        const fecha = t.fecha;      return `
        <div class="card historial-card">
          <p class="texto">${t.tipo_tratamiento}<br>${fecha}</p>
          <strong>Profesional: ${t.profesional}</strong>
        </div>
      `;
    }).join("");
  })
  .catch(err => console.error("Error historial:", err));

fetch(`${BASE_URL}/paciente/recomendacion/${id}`)
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("contenedor-recomendacion");
    if (!data.success || !data.recomendacion) {
      contenedor.innerHTML = "<p class='texto'>No hay recomendaciones disponibles.</p>";
      return;
    }

    const r = data.recomendacion;
    contenedor.innerHTML = `
      <div class="card-tratamiento">
        <img src="img/face-sparkel.png" alt="Facial" class="icono-card" />
        <p>${r.tipo_recomendacion}</p>
        <a href="https://encuadrado.com/p/cosmetologia-iconic-clinic/" target="_blank"
          class="btn-agenda-recomendacion">Agenda aquí</a>
      </div>
    `;
  })
  .catch(err => console.error(" Error recomendación:", err));
});
