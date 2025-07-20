document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://iconiclinic-web.onrender.com/api";

  const btnLoginHeader = document.querySelector(".btn-login");
  const dropdown = document.getElementById("modal-dropdown");
  const modal = document.getElementById("modal-login");
  const btnOpenLogin = document.querySelector(".btn-open-login");
  const closeBtn = document.querySelector(".close-modal");
  const registerModal = document.getElementById("modal-register");
  const loginModal = document.getElementById("modal-login");
  const btnPatientModal = document.getElementById("btnPatientModal");
  const modalPatient = document.getElementById("modal-patient");
  const closePatientModal = document.getElementById("closePatientModal");
  const dropdownToggles = document.querySelectorAll(".toggle-dropdown");
  const loginForm = document.querySelector("#modal-login form");
  const rutinaModal = document.getElementById("modal-rutina");
  const closeRutinaModal = document.getElementById("closeModalRutina");
  const openRutinaButtons = document.querySelectorAll(".open-rutina");
  const tratamientoModal = document.getElementById("modal-tratamiento");
  const closeTratamientoModal = document.getElementById("closeModalTratamiento");
  const openTratamientoButtons = document.querySelectorAll(".open-tratamiento");
  const recomendacionModal = document.getElementById("modal-recomendacion");
  const closeRecomendacionModal = document.getElementById("closeModalRecomendacion");
  const openRecomendacionButtons = document.querySelectorAll(".open-recomendacion");

  // Dropdown login del header
  if (btnLoginHeader && dropdown) {
    btnLoginHeader.addEventListener("click", (e) => {
      if (btnLoginHeader.classList.contains("logout-btn")) return;
      e.preventDefault();
      dropdown.classList.toggle("hidden");
    });

    window.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !btnLoginHeader.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });
  }

  // Abrir y cerrar modal login
  if (btnOpenLogin && modal && closeBtn) {
    btnOpenLogin.addEventListener("click", () => {
      dropdown?.classList.add("hidden");
      modal.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  // Cambio entre login y register
  if (registerModal && loginModal) {
    const btnOpenRegister = document.querySelector(".btn-open-register");
    const closeRegister = registerModal.querySelector(".close-modal");

    if (btnOpenRegister) {
      btnOpenRegister.addEventListener("click", () => {
        loginModal.classList.add("hidden");
        registerModal.classList.remove("hidden");
      });
    }

    if (closeRegister) {
      closeRegister.addEventListener("click", () => {
        registerModal.classList.add("hidden");
      });
    }
  }

  // Modal paciente
  if (btnPatientModal && modalPatient && closePatientModal) {
    btnPatientModal.addEventListener("click", (e) => {
      e.preventDefault();
      modalPatient.classList.remove("hidden");
    });

    closePatientModal.addEventListener("click", () => {
      modalPatient.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === modalPatient) {
        modalPatient.classList.add("hidden");
      }
    });
  }

  // Desplegables personalizados
  dropdownToggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = btn.nextElementSibling;
      if (dropdown) {
        dropdown.classList.toggle("hidden");
      }
    });
  });

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector("input[type='email']").value;
      const password = loginForm.querySelector("input[type='password']").value;

      try {
        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (data.success) {
          localStorage.setItem("id_usuario", data.id_usuario);
          localStorage.setItem("tipo", data.tipo);
          if (data.tipo === "paciente") {
            window.location.href = "paciente.html";
          } else if (data.tipo === "profesional") {
            window.location.href = "profesional.html";
          }
        } else {
          alert("Credenciales inválidas");
        }
      } catch (err) {
        console.error(err);
        alert("Error al conectarse con el servidor");
      }
    });
  }

  // Registro
  const registerForm = registerModal?.querySelector("form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = registerForm.querySelectorAll("input");
      const rut = inputs[0].value.trim();
      const email = inputs[1].value.trim();
      const password = inputs[2].value.trim();

      if (!rut || !email || !password) {
        alert("Todos los campos son obligatorios.");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rut, email, password })
        });

        const data = await res.json();

        if (data.success) {
          alert("¡Registro exitoso! Ya puedes iniciar sesión.");
          registerForm.reset();
          registerModal.classList.add("hidden");
        } else {
          alert("❌ " + (data.message || "Error al registrarse."));
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error de red.");
      }
    });
  }

  // Modal rutina
  if (rutinaModal && closeRutinaModal && openRutinaButtons.length > 0) {
    openRutinaButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        rutinaModal.classList.remove("hidden");
      });
    });

    closeRutinaModal.addEventListener("click", () => {
      rutinaModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === rutinaModal) {
        rutinaModal.classList.add("hidden");
      }
    });
  }

  // Modal tratamiento
  if (tratamientoModal && closeTratamientoModal && openTratamientoButtons.length > 0) {
    openTratamientoButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        tratamientoModal.classList.remove("hidden");
      });
    });

    closeTratamientoModal.addEventListener("click", () => {
      tratamientoModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === tratamientoModal) {
        tratamientoModal.classList.add("hidden");
      }
    });
  }

  // Modal recomendación
  if (recomendacionModal && closeRecomendacionModal && openRecomendacionButtons.length > 0) {
    openRecomendacionButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        recomendacionModal.classList.remove("hidden");
      });
    });

    closeRecomendacionModal.addEventListener("click", () => {
      recomendacionModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === recomendacionModal) {
        recomendacionModal.classList.add("hidden");
      }
    });
  }
});
