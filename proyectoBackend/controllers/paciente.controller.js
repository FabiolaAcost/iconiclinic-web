const db = require("../db");

//GET http://localhost:3000/api/paciente/rutina/{idPaciente}
const obtenerRutinaPaciente = (req, res) => {
  const { id_paciente } = req.params;

  const query = `
    SELECT tipo, descripcion, consejo
    FROM rutina
    WHERE id_paciente = ?
  `;

  db.query(query, [id_paciente], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error al obtener rutina" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "No hay rutina registrada para este paciente" });
    }

    const rutina = {
      dia: null,
      noche: null,
      consejos: null
    };

    results.forEach(r => {
      const tipo = r.tipo.toLowerCase();
      if (tipo === "día") rutina.dia = { descripcion: r.descripcion, consejo: r.consejo };
      else if (tipo === "noche") rutina.noche = { descripcion: r.descripcion, consejo: r.consejo };
      else if (tipo === "consejos") rutina.consejos = { descripcion: r.descripcion };
    });

    res.json({
      success: true,
      rutina
    });
  });
};


//GET http://localhost:3000/api/paciente/historial/{idPaciente}
const obtenerHistorialTratamientos = (req, res) => {
    const { id_paciente } = req.params;
  
    const query = `
      SELECT t.fecha, pr.nombre AS profesional, tt.nombre AS tipo_tratamiento
      FROM tratamiento t
      JOIN profesional pr ON t.id_profesional = pr.id_profesional
      JOIN tipo_tratamiento tt ON t.id_tipo_tratamiento = tt.id_tipo_tratamiento
      WHERE t.id_paciente = ?
      ORDER BY t.fecha DESC
    `;
  
    db.query(query, [id_paciente], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error al obtener historial" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "No hay tratamientos registrados" });
      }
  
      res.status(200).json({
        success: true,
        historial: results
      });
    });
};

//GET http://localhost:3000/api/paciente/recomendacion/{idPaciente}
const obtenerUltimaRecomendacion = (req, res) => {
    const { id_paciente } = req.params;
  
    const query = `
      SELECT r.fecha, pr.nombre AS profesional, tr.nombre AS tipo_recomendacion
      FROM recomendacion r
      JOIN profesional pr ON r.id_profesional = pr.id_profesional
      JOIN tipo_recomendacion tr ON r.id_tipo_recomendacion = tr.id_tipo_recomendacion
      WHERE r.id_paciente = ?
      ORDER BY r.fecha DESC
      LIMIT 1
    `;
  
    db.query(query, [id_paciente], (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error al obtener recomendación" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "No hay recomendaciones registradas" });
      }
  
      res.status(200).json({
        success: true,
        recomendacion: results[0]
      });
    });
  };


module.exports = { obtenerRutinaPaciente, obtenerHistorialTratamientos, obtenerUltimaRecomendacion };
