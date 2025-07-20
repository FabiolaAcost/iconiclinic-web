const db = require("../db");
const transporter = require("../mailer/mailer");

function enviarRecordatorioMensual() {
  const query = `
    SELECT p.id_paciente, u.email, p.nombre
    FROM paciente p
    JOIN usuario u ON p.id_usuario = u.id_usuario
  `;

  db.query(query, async (err, results) => {
    if (err) {
      console.error("Error al obtener pacientes:", err);
      return;
    }

    for (const paciente of results) {
      const mailOptions = {
        from: '"IconiClinic" <iconicClinic@gmail.com>',
        to: paciente.email,
        subject: "Recordatorio: agenda tu próximo tratamiento en IconiClinic",
        html: `
      <p>Estimada/o ${paciente.nombre},</p>
      <p>Esperamos que te encuentres bien. Queremos recordarte que puedes agendar tu próxima sesión de tratamiento cuando lo estimes conveniente.</p>
      <p>Para facilitar tu continuidad de cuidado, hemos habilitado nuestra plataforma de agenda en línea:</p>
      <p><a href="https://iconiclinic.netlify.app" target="_blank">Haz clic aquí para acceder</a></p>
      <br>
      <p>Saludos cordiales,</p>
      <p><strong>Equipo IconiClinic</strong></p>
    `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${paciente.email}`);
      } catch (err) {
        console.error(`Error al enviar a ${paciente.email}:`, err);
      }
    }
  });
}

module.exports = { enviarRecordatorioMensual };
