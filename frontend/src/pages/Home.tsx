import Button from "../components/CustomButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { LogoPrimary } from "../components/Logo";
import FilmeCard from "../components/FilmeCard";
import { useFilmes } from "../hooks/useFilmes";
import { useState } from "react";
import { Filme } from "../models/Filme";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { filmes, loading } = useFilmes();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  //filtra os filmes por nome
  const filteredFilmes = filmes.filter(filme =>
    filme.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //agrupa filmes por descrição do gênero e pega os 5 primeiros por gênero
  const filmesPorGenero = filmes.reduce((acc, filme) => {
    filme.generos.forEach(genero => {
      const nomeGenero = genero.descricao;
      if (!acc[nomeGenero]) {
        acc[nomeGenero] = [];
      }
      if (acc[nomeGenero].length < 5) {
        acc[nomeGenero].push(filme);
      }
    });
    return acc;
  }, {} as Record<string, Filme[]>);

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary">
      <Header />

      <div className="flex-1 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
        <LogoPrimary size={160} />

        <h1 className="text-4xl font-bold">Bem-vindo ao Boscov!</h1>
        <p className="text-secondary text-lg">
          Avalie filmes, compartilhe opiniões e descubra o que assistir.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mt-6">
          <Button className="w-44" onClick={() => navigate("/filmes")}>Ver Filmes</Button>
        </div>
      </div>

      <section className="py-8 px-4 max-w-6xl mx-auto">
        {/*barra de pesquisa*/}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar filmes por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border rounded-md shadow-md text-black"
          />
        </div>

        {loading ? (
          <p>Carregando filmes...</p>
        ) : searchTerm ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Resultados para "{searchTerm}"
            </h2>
            {filteredFilmes.length === 0 ? (
              <p>Nenhum filme encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredFilmes.map(filme => (
                  <FilmeCard key={filme.id} filme={filme} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Filmes em Destaque</h2>
            {Object.keys(filmesPorGenero).map((genero) => (
              <div key={genero} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{genero}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filmesPorGenero[genero].map((filme) => (
                    <FilmeCard key={filme.id} filme={filme} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
