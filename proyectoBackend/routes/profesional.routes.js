const express = require("express");
const router = express.Router();
const { agregarPaciente, registrarProfesional, obtenerPacientesDelProfesional, guardarRutina, guardarTratamiento, guardarRecomendacion} = require("../controllers/profesional.controller");

router.post("/paciente", agregarPaciente);
router.post("/registrar-profesional",registrarProfesional);
router.get("/pacientes/:id_usuario", obtenerPacientesDelProfesional);
router.post("/rutina/:id_paciente", guardarRutina);
router.post("/tratamiento/:id_paciente", guardarTratamiento);
router.post("/recomendacion/:id_paciente", guardarRecomendacion);


module.exports = router;
