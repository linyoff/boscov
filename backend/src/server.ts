import app from "./app";
import users from "./routes/user.routes"

const PORT = process.env.PORT || 3000;

//rotas
app.use("/user", users);

//inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
