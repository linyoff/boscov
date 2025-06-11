import app from "./app";
import 'dotenv/config'; 
import users from "./routes/user.routes"
import filmes from "./routes/filme.routes"
import generos from "./routes/genero.routes"
import generoFilmes from "./routes/generoFilme.routes"
import avaliacoes from "./routes/avaliacao.routes";

const PORT = process.env.PORT || 3000;

//rotas
app.use("/user", users);
app.use("/filme", filmes);
app.use("/genero", generos);
app.use("/genero-filme", generoFilmes);
app.use("/avaliacao", avaliacoes);

//inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
