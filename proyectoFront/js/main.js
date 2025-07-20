document.addEventListener("DOMContentLoaded", () => {
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

  dropdownToggles.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdown = btn.nextElementSibling;
      if (dropdown) {
        dropdown.classList.toggle("hidden");
      }
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector("input[type='email']").value;
      const password = loginForm.querySelector("input[type='password']").value;

      try {
        const res = await fetch("https://iconiclinic-web.onrender.com/api/login", {
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
