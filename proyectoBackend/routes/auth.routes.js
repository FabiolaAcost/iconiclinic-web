const express = require("express");
const router = express.Router();
const { registrarUsuario, loginUsuario,encriptarPassword } = require("../controllers/auth.controller");

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);  
router.post("/encrypt-password", encriptarPassword);

module.exports = router;