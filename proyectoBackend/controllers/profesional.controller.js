const db = require("../db");
const bcrypt = require("bcrypt");

const registrarProfesional = async (req, res) => {
  const { nombre, rut, email, password, profesion } = req.body;

  if (!nombre || !rut || !email || !password || !profesion) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
  }

  const checkQuery = "SELECT * FROM usuario WHERE rut = ? OR email = ?";
  db.query(checkQuery, [rut, email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error al buscar usuario" });

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: "El RUT o email ya están registrados" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUsuario = "INSERT INTO usuario (rut, email, contraseña, id_rol) VALUES (?, ?, ?, 2)";
    db.query(insertUsuario, [rut, email, hashedPassword], (err2, resultUsuario) => {
      if (err2) return res.status(500).json({ success: false, message: "Error al crear usuario" });

      const id_usuario = resultUsuario.insertId;

      const insertProfesional = "INSERT INTO profesional (nombre, profesion, id_usuario) VALUES (?, ?, ?)";
      db.query(insertProfesional, [nombre, profesion, id_usuario], (err3, resultProfesional) => {
        if (err3) return res.status(500).json({ success: false, message: "Error al crear profesional" });

        res.status(201).json({
          success: true,
          message: "Profesional registrado correctamente",
          id_profesional: resultProfesional.insertId
        });
      });
    });
  });
};

const agregarPaciente = (req, res) => {
  const { nombre, rut, email } = req.body;

  if (!nombre || !rut || !email) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
  }

  const checkQuery = "SELECT * FROM usuario WHERE rut = ? OR email = ?";
  db.query(checkQuery, [rut, email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error al verificar usuario" });

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: "Ya existe un usuario con ese RUT o email" });
    }

    const insertUsuario = "INSERT INTO usuario (rut, email, contraseña, id_rol) VALUES (?, ?, '', 1)";
    db.query(insertUsuario, [rut, email], (err2, resultUsuario) => {
      if (err2) return res.status(500).json({ success: false, message: "Error al crear usuario" });

      const id_usuario = resultUsuario.insertId;

      const insertPaciente = "INSERT INTO paciente (nombre, id_usuario) VALUES (?, ?)";
      db.query(insertPaciente, [nombre, id_usuario], (err3, resultPaciente) => {
        if (err3) return res.status(500).json({ success: false, message: "Error al crear paciente" });

        res.status(201).json({ success: true, message: "Paciente creado correctamente", id_paciente: resultPaciente.insertId });
      });
    });
  });
};

module.exports = { agregarPaciente,registrarProfesional };
