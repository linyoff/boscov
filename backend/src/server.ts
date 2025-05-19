import app from "./app";
import users from "./routes/user.routes"
import filmes from "./routes/filme.routes"
import avaliacoes from "./routes/avaliacao.routes";

const PORT = process.env.PORT || 3000;

//rotas
app.use("/user", users);
app.use("/filme", filmes);
app.use("/avaliacao", avaliacoes);

//inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
