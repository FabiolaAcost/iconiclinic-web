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

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
