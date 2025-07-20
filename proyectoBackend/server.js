const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const authRoutes = require("./routes/auth.routes");
const profesionalRoutes = require("./routes/profesional.routes");
const pacienteRoutes = require("./routes/paciente.routes");

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/profesional", profesionalRoutes);
app.use("/api/paciente", pacienteRoutes);


const cron = require("node-cron");
const { enviarRecordatorioMensual } = require("./tareas/recordatorioMensual");


cron.schedule("0 10 1 * *", () => {
  console.log("Ejecutando tarea mensual de recordatorio...");
  enviarRecordatorioMensual();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
