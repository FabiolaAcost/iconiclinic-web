document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://iconiclinic-web.onrender.com/api";
  const id_usuario = localStorage.getItem("id_usuario");
  const tbody = document.querySelector(".tabla-pacientes tbody");
  let pacienteActivo = null;

  const formTratamiento = document.querySelector(
    "#modal-tratamiento .formulario-modal"
  );

  const formRecomendacion = document.querySelector(
    "#modal-recomendacion .formulario-modal"
  );

  if (!id_usuario) {
    alert("Sesión expirada. Inicia sesión nuevamente.");
    window.location.href = "index.html";
    return;
  }

  async function cargarPacientes() {
    try {
      const res = await fetch(
        `${BASE_URL}/profesional/pacientes/${id_usuario}`
      );
      const data = await res.json();

      if (!data.success || !data.pacientes || data.pacientes.length === 0) {
        tbody.innerHTML =
          "<tr><td colspan='2'>No hay pacientes registrados</td></tr>";
        return;
      }

      tbody.innerHTML = data.pacientes
        .map(
          (p) => `
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
      `
        )
        .join("");

      configurarModales();
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
    }
  }

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
          body: JSON.stringify({ nombre, rut, email, id_usuario }),
        });

        const data = await res.json();
        if (data.success) {
          alert("Paciente registrado correctamente");
          form.reset();
          document.getElementById("modal-patient").classList.add("hidden");
          await cargarPacientes();
        } else {
          alert(data.message || "Error al registrar paciente");
        }
      } catch (err) {
        console.error("❌ Error al registrar paciente:", err);
        alert("Error de red");
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggle-dropdown")) {
      const dropdown = e.target.nextElementSibling;
      dropdown?.classList.toggle("hidden");
    } else {
      document
        .querySelectorAll(".dropdown-acciones")
        .forEach((d) => d.classList.add("hidden"));
    }
  });

  function configurarModales() {
    const modalRutina = document.getElementById("modal-rutina");
    const modalTratamiento = document.getElementById("modal-tratamiento");
    const modalRecomendacion = document.getElementById("modal-recomendacion");

    document.querySelectorAll(".open-rutina").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        pacienteActivo = btn.dataset.id;
        modalRutina.classList.remove("hidden");
      });
    });

    document.querySelectorAll(".open-tratamiento").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        pacienteActivo = btn.dataset.id;
        modalTratamiento.classList.remove("hidden");
      });
    });

    document.querySelectorAll(".open-recomendacion").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        pacienteActivo = btn.dataset.id;
        modalRecomendacion.classList.remove("hidden");
      });
    });

    document
      .getElementById("closeModalRutina")
      ?.addEventListener("click", () => modalRutina.classList.add("hidden"));
    document
      .getElementById("closeModalTratamiento")
      ?.addEventListener("click", () =>
        modalTratamiento.classList.add("hidden")
      );
    document
      .getElementById("closeModalRecomendacion")
      ?.addEventListener("click", () =>
        modalRecomendacion.classList.add("hidden")
      );

    window.getPacienteActivo = () => pacienteActivo;
  }

  cargarPacientes();

  const rutinaForm = document.querySelector("#modal-rutina .formulario-modal");
  function obtenerIdTipo(descripcion, tipo) {
    const texto = descripcion.trim().toLowerCase();

    if (tipo === "tratamiento") {
      if (texto.startsWith("li")) return 1;
      if (texto.startsWith("hi")) return 2;
      if (texto.startsWith("in")) return 3;
    }

    if (tipo === "recomendacion") {
      if (texto.startsWith("li")) return 1;
      if (texto.startsWith("hi")) return 2;
      if (texto.startsWith("in")) return 3;
    }

    return null;
  }
  if (rutinaForm) {
    rutinaForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = rutinaForm.querySelectorAll("input");
      const rutina_dia = inputs[0].value.trim();
      const rutina_noche = inputs[1].value.trim();
      const consejos_texto = inputs[2].value.trim();

      if (!rutina_dia || !rutina_noche || !consejos_texto) {
        return alert("Todos los campos son obligatorios");
      }

      const id_paciente = window.getPacienteActivo();
      if (!id_paciente) return alert("Paciente no seleccionado");

      try {
        const res = await fetch(
          `${BASE_URL}/profesional/rutina/${id_paciente}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rutina_dia,
              rutina_noche,
              consejos_texto,
              consejo_dia: "Aplicar protector solar cada 3 horas",
              consejo_noche: "Realizar rutina PM obligatoriamente",
            }),
          }
        );

        const data = await res.json();
        if (data.success) {
          alert("Rutina guardada correctamente");
          rutinaForm.reset();
          document.getElementById("modal-rutina").classList.add("hidden");
        } else {
          alert("Error al guardar rutina: " + (data.message || ""));
        }
      } catch (err) {
        console.error("Error al guardar rutina:", err);
        alert("Error al conectarse al servidor");
      }
    });
  }

  if (formTratamiento) {
    formTratamiento.addEventListener("submit", async (e) => {
      e.preventDefault();

      const descripcion = formTratamiento.querySelector("input").value.trim();
      const id_profesional = localStorage.getItem("id_usuario");
      const id_paciente = window.getPacienteActivo();

      const id_tipo_tratamiento = obtenerIdTipo(descripcion, "tratamiento");

      if (
        !descripcion ||
        !id_profesional ||
        !id_paciente ||
        !id_tipo_tratamiento
      ) {
        return alert(
          "Todos los campos son obligatorios y debe coincidir con un tipo válido (Li, Hi, In)"
        );
      }

      try {
        const res = await fetch(
          `${BASE_URL}/profesional/tratamiento/${id_paciente}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_profesional, id_tipo_tratamiento }),
          }
        );

        const data = await res.json();
        if (data.success) {
          alert("Tratamiento registrado");
          formTratamiento.reset();
          document.getElementById("modal-tratamiento").classList.add("hidden");
        } else {
          alert(
            "Error: " + (data.message || "No se pudo registrar tratamiento")
          );
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Error al conectarse al servidor");
      }
    });
  }

  if (formRecomendacion) {
    formRecomendacion.addEventListener("submit", async (e) => {
      e.preventDefault();

      const texto = formRecomendacion.querySelector("input").value.trim();
      const id_profesional = localStorage.getItem("id_usuario");
      const id_paciente = window.getPacienteActivo();

      const id_tipo_recomendacion = obtenerIdTipo(texto, "recomendacion");

      if (!texto || !id_profesional || !id_paciente || !id_tipo_recomendacion) {
        return alert(
          "Todos los campos son obligatorios y debe comenzar con: Li, Hi o In"
        );
      }

      try {
        const res = await fetch(
          `${BASE_URL}/profesional/recomendacion/${id_paciente}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_profesional, id_tipo_recomendacion }),
          }
        );

        const data = await res.json();
        if (data.success) {
          alert("Recomendación registrada");
          formRecomendacion.reset();
          document
            .getElementById("modal-recomendacion")
            .classList.add("hidden");
        } else {
          alert(
            "Error: " +
              (data.message || "No se pudo registrar recomendación")
          );
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Error al conectarse al servidor");
      }
    });
  }
});
