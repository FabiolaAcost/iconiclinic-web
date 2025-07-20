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
  const { nombre, rut, email, id_usuario } = req.body; // id_usuario del profesional

  if (!nombre || !rut || !email || !id_usuario) {
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

      const id_nuevo_usuario = resultUsuario.insertId;

    
      const insertPaciente = "INSERT INTO paciente (nombre, id_usuario) VALUES (?, ?)";
      db.query(insertPaciente, [nombre, id_nuevo_usuario], (err3, resultPaciente) => {
        if (err3) return res.status(500).json({ success: false, message: "Error al crear paciente" });

        const id_paciente = resultPaciente.insertId;

        const buscarProfesional = "SELECT id_profesional FROM profesional WHERE id_usuario = ?";
        db.query(buscarProfesional, [id_usuario], (err4, resultProf) => {
          if (err4) return res.status(500).json({ success: false, message: "Error al obtener profesional" });
          if (resultProf.length === 0) {
            return res.status(404).json({ success: false, message: "Profesional no encontrado" });
          }

          const id_profesional = resultProf[0].id_profesional;

          const insertRelacion = "INSERT INTO profesional_paciente (id_profesional, id_paciente) VALUES (?, ?)";
          db.query(insertRelacion, [id_profesional, id_paciente], (err5) => {
            if (err5) return res.status(500).json({ success: false, message: "Error al vincular paciente al profesional" });

            res.status(201).json({ success: true, message: "Paciente creado y vinculado correctamente", id_paciente });
          });
        });
      });
    });
  });
};

const obtenerPacientesDelProfesional = (req, res) => {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ success: false, message: "ID de usuario requerido" });
  }

  const queryProfesional = `SELECT id_profesional FROM profesional WHERE id_usuario = ?`;
  db.query(queryProfesional, [id_usuario], (err1, result1) => {
    if (err1) {
      return res.status(500).json({ success: false, message: "Error al buscar profesional" });
    }

    if (result1.length === 0) {
      return res.status(404).json({ success: false, message: "Profesional no encontrado" });
    }

    const id_profesional = result1[0].id_profesional;

    const queryPacientes = `
      SELECT p.id_paciente, p.nombre, u.rut, u.email
      FROM profesional_paciente pp
      JOIN paciente p ON pp.id_paciente = p.id_paciente
      JOIN usuario u ON p.id_usuario = u.id_usuario
      WHERE pp.id_profesional = ?;
    `;

    db.query(queryPacientes, [id_profesional], (err2, results) => {
      if (err2) {
        return res.status(500).json({ success: false, message: "Error al obtener pacientes" });
      }

      res.status(200).json({ success: true, pacientes: results });
    });
  });
};


const guardarRutina = (req, res) => {
  const { id_paciente } = req.params;
  const { rutina_dia, rutina_noche, consejos_texto, consejo_dia, consejo_noche } = req.body;

  if (!rutina_dia || !rutina_noche || !consejos_texto) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
  }

  const query = `
    INSERT INTO rutina (tipo, descripcion, consejo, id_paciente) VALUES
    (?, ?, ?, ?),
    (?, ?, ?, ?),
    (?, ?, ?, ?)
  `;

  const values = [
    "Día", rutina_dia, consejo_dia || "", id_paciente,
    "Noche", rutina_noche, consejo_noche || "", id_paciente,
    "Consejos", consejos_texto, "", id_paciente
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error al guardar rutina compuesta" });
    }

    res.status(201).json({
      success: true,
      message: "Rutina dividida en Día, Noche y Consejos guardada correctamente",
      registros_insertados: result.affectedRows
    });
  });
};


const guardarTratamiento = (req, res) => {
  const { id_paciente } = req.params;
  const { id_profesional, id_tipo_tratamiento} = req.body;

  if (!id_profesional || !id_tipo_tratamiento) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
  }

  const fechaTratamiento = new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD

  const query = `
    INSERT INTO tratamiento (fecha, id_paciente, id_profesional, id_tipo_tratamiento)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [fechaTratamiento, id_paciente, id_profesional, id_tipo_tratamiento], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error al registrar tratamiento" });
    }

    res.status(201).json({
      success: true,
      message: "Tratamiento registrado correctamente",
      id_tratamiento: result.insertId
    });
  });
};


const guardarRecomendacion = (req, res) => {
  const { id_paciente } = req.params;
  const { id_profesional, id_tipo_recomendacion} = req.body;

  if (!id_profesional || !id_tipo_recomendacion) {
    return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
  }

  const fechaRecomendacion = new Date().toISOString().slice(0, 10);

  const query = `
    INSERT INTO recomendacion (fecha, id_paciente, id_profesional, id_tipo_recomendacion)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [fechaRecomendacion, id_paciente, id_profesional, id_tipo_recomendacion], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error al registrar recomendación" });
    }

    res.status(201).json({
      success: true,
      message: "Recomendación registrada correctamente",
      id_recomendacion: result.insertId
    });
  });
};


module.exports = { 
  agregarPaciente,
  registrarProfesional,
  obtenerPacientesDelProfesional,
  guardarRutina,guardarTratamiento,
  guardarRecomendacion};