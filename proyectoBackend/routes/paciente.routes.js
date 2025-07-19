const express = require("express");
const router = express.Router();
const { obtenerRutinaPaciente, obtenerHistorialTratamientos, obtenerUltimaRecomendacion } = require("../controllers/paciente.controller");

router.get("/rutina/:id_paciente", obtenerRutinaPaciente);
router.get("/historial/:id_paciente", obtenerHistorialTratamientos);
router.get("/recomendacion/:id_paciente", obtenerUltimaRecomendacion);

module.exports = router;
