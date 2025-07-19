const bcrypt = require("bcrypt");
const db = require("../db");


const encriptarPassword = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: "Debes enviar una contraseña" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    res.status(200).json({ success: true, hashedPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al encriptar contraseña" });
  }
};

const registrarUsuario = async (req, res) => {
  const { rut, email, password } = req.body;

  if (!rut || !email || !password) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
  }

  try {
    const queryCheck = "SELECT * FROM usuario WHERE rut = ? AND email = ? AND id_rol = 1";
    db.query(queryCheck, [rut, email], async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Error al buscar usuario" });

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "El usuario no ha sido registrado previamente como paciente"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updateQuery = "UPDATE usuario SET contraseña = ? WHERE rut = ? AND email = ?";
      db.query(updateQuery, [hashedPassword, rut, email], (err2, result) => {
        if (err2) return res.status(500).json({ success: false, message: "Error al actualizar contraseña" });

        res.status(200).json({ success: true, message: "Usuario registrado correctamente" });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};


const loginUsuario = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email y contraseña son obligatorios" });
  }

  const query = "SELECT * FROM usuario WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error al buscar usuario" });

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }

    const usuario = results[0];

    const isMatch = await bcrypt.compare(password, usuario.contraseña);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }

    let tipoUsuario = "desconocido";
    if (usuario.id_rol === 1) tipoUsuario = "paciente";
    if (usuario.id_rol === 2) tipoUsuario = "profesional";

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      tipo: tipoUsuario,
      id_usuario: usuario.id_usuario,
    });
  });
};

module.exports = {
  registrarUsuario,
  loginUsuario,encriptarPassword
};