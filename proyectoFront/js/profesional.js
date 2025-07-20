document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://iconiclinic-web.onrender.com/api";
  const id = localStorage.getItem("id_usuario");

  if (!id) {
    alert("Sesión expirada. Inicia sesión nuevamente.");
    window.location.href = "index.html";
    return;
  }

  fetch(`${BASE_URL}/profesional/pacientes/${id}`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector(".tabla-pacientes tbody");
      if (!data.success || !data.pacientes || data.pacientes.length === 0) {
        tbody.innerHTML = "<tr><td colspan='2'>No hay pacientes registrados</td></tr>";
        return;
      }

      tbody.innerHTML = data.pacientes.map(p => `
        <tr>
          <td><i>${p.nombre}</i></td>
          <td>
            <div class="acciones">
              <button class="btn-editar toggle-dropdown">Editar <i class="fas fa-chevron-down"></i></button>
              <div class="dropdown-acciones hidden">
                <ul>
                  <li><a href="#" class="open-rutina" data-id="${p.id_paciente}">Rutina</a></li>
                  <li><a href="#" class="open-tratamiento" data-id="${p.id_paciente}">Tratamiento</a></li>
                  <li><a href="#" class="open-recomendacion" data-id="${p.id_paciente}">Recomendación</a></li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
      `).join("");
    })
    .catch(err => {
      console.error("❌ Error al cargar pacientes:", err);
    });

  const form = document.querySelector("#modal-patient .formulario-modal");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = form.querySelectorAll("input");
      const nombre = inputs[0].value.trim();
      const rut = inputs[1].value.trim();
      const email = inputs[2].value.trim();

      try {
        const res = await fetch(`${BASE_URL}/profesional/paciente`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, rut, email })
        });

        const data = await res.json();
        if (data.success) {
          alert("Paciente registrado correctamente");
          location.reload();
        } else {
          alert(data.message || "Error al registrar paciente");
        }
      } catch (err) {
        console.error("Error al registrar paciente:", err);
        alert("Error de red");
      }
    });
  }

  // ✅ Toggle para mostrar dropdown de acciones
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggle-dropdown")) {
      const dropdown = e.target.nextElementSibling;
      dropdown?.classList.toggle("hidden");
    } else {
      document.querySelectorAll(".dropdown-acciones").forEach(d => d.classList.add("hidden"));
    }
  });
});
