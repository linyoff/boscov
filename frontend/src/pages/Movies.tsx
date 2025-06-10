import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FilmeCard from "../components/FilmeCard";
import { useFilmes } from "../hooks/useFilmes";
import { Filme } from "../models/Filme";

export default function Movies() {
  const { filmes, loading } = useFilmes();
  const [currentPage, setCurrentPage] = useState(1);
  const filmesPorPagina = 10;

  const totalPaginas = Math.ceil(filmes.length / filmesPorPagina);

  const indexInicio = (currentPage - 1) * filmesPorPagina;
  const indexFim = indexInicio + filmesPorPagina;
  const filmesPaginaAtual = filmes.slice(indexInicio, indexFim);

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setCurrentPage(novaPagina);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Todos os Filmes</h1>

        {loading ? (
          <p className="text-center">Carregando filmes...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filmesPaginaAtual.map((filme: Filme) => (
                <FilmeCard key={filme.id} filme={filme} />
              ))}
            </div>

            {/* Paginação */}
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => mudarPagina(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-secondary text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => mudarPagina(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-accent text-black font-semibold"
                      : "bg-white text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => mudarPagina(currentPage + 1)}
                disabled={currentPage === totalPaginas}
                className="px-4 py-2 bg-secondary text-white rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
