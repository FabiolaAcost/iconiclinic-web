const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const usuarios = [
  {
    email: "valentina@gmail.com",
    password: "123456",
    tipo: "paciente"
  },
  {
    email: "fabiola@gmail.com",
    password: "123456",
    tipo: "profesional"
  }
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = usuarios.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (user) {
    res.json({ success: true, tipo: user.tipo });
  } else {
    res.status(401).json({ success: false, message: "Credenciales inválidas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
