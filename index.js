const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
const uuid = require("uuid");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.post("/sign-in", (req, res) => {
  const { userName: user_name, password } = req.body;

  const user = data.users.find(
    (u) => u.accountUserName === user_name && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Si se encuentra un usuario que coincida, responder con los valores requeridos
  const { avatar, userName, email, authority } = user;
  // Si las credenciales son correctas, puedes devolver un token de autenticación
  const token = "wVYrxaeNa9OxdnULvde1Au5m5w63";

  res.send({
    user: { avatar, userName, email, authority },
    token,
  });
});

app.post("/sign-out", (req, res) => {
  const { token } = req.body;
  const message = "Sesión cerrada exitosamente";
  // Código para invalidar el token aquí

  res.send(true);
});

app.post("/sign-up", (req, res) => {
  const { userName, email, password } = req.body;

  // Validar que el nombre de usuario de la cuenta no exista ya en la base de datos
  if (data.users.some((u) => u.accountUserName === userName)) {
    return res
      .status(400)
      .json({ message: "El nombre de usuario de la cuenta ya existe" });
  }

  // Generar un nuevo ID para el usuario
  const _id = uuid.v4();
  // const _id = data.users.length + 1;

  // Crear un nuevo objeto de usuario con los datos enviados por el cliente
  const newUser = {
    avatar: "/img/avatars/thumb-1.jpg",
    userName,
    email,
    authority: ["admin", "user"],
  };

  // Agregar el nuevo usuario a la base de datos
  data.users.push({ id: _id, ...newUser, password, accountUserName: userName });

  // Guardar los cambios en la base de datos
  fs.writeFileSync("data.json", JSON.stringify(data));

  // Devolver una respuesta con el nuevo usuario creado
  const token = "wVYrxaeNa9OxdnULvde1Au5m5w63";
  const message = "Usuario creado exitosamente";
  res.status(201).json({ user: newUser, token });
});

app.listen(4000, () => {
  console.log("Servidor iniciado en el puerto 4000");
});
