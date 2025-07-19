const express = require("express");
const router = express.Router();
const { agregarPaciente, registrarProfesional } = require("../controllers/profesional.controller");

router.post("/paciente", agregarPaciente);
router.post("/registrar-profesional",registrarProfesional)

module.exports = router;
