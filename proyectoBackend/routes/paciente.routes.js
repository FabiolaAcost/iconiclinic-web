const express = require("express");
const router = express.Router();
const { obtenerRutinaPaciente, obtenerHistorialTratamientos, obtenerUltimaRecomendacion } = require("../controllers/paciente.controller");

router.get("/rutina/:id_usuario", obtenerRutinaPaciente);
router.get("/historial/:id_usuario", obtenerHistorialTratamientos);
router.get("/recomendacion/:id_usuario", obtenerUltimaRecomendacion);

module.exports = router;
