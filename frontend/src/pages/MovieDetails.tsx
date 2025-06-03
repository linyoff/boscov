import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Filme } from "../models/Filme";
import { useFilmes } from "../hooks/useFilmes";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchFilmeById } = useFilmes();
  const [filme, setFilme] = useState<Filme | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarFilme = async () => {
      if (id) {
        const data = await fetchFilmeById(id);
        setFilme(data);
      }
      setCarregando(false);
    };

    buscarFilme();
  }, [id, fetchFilmeById]);

  if (carregando)
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <p className="text-xl font-semibold text-white animate-pulse">
          Carregando...
        </p>
      </div>
    );

  if (!filme)
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <p className="text-xl font-semibold text-red-500">Filme não encontrado.</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center w-full p-6">
        <div className="w-full max-w-5xl bg-tertiary rounded-xl shadow-lg text-textPrimary p-6 mb-6">

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src={filme.poster}
              alt={`Capa de ${filme.nome}`}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
            />

            <div className="flex flex-col justify-center text-textPrimary">
              <h1 className="text-3xl font-bold mb-4">{filme.nome}</h1>
              <p className="text-sm mb-1">
                <strong>Ano de Lançamento:</strong> {filme.anoLancamento}
              </p>
              <p className="text-sm mb-1">
                <strong>Duração:</strong> {filme.duracao} minutos
              </p>
              <p className="text-sm mb-1">
                <strong>Diretor:</strong> {filme.diretor}
              </p>
              <p className="text-sm mb-1">
                <strong>Produtora:</strong> {filme.produtora}
              </p>
              <p className="text-sm mb-1">
                <strong>Classificação:</strong> {filme.classificacao}
              </p>

              {filme.generos?.length > 0 ? (
                <div className="mt-3">
                  <strong>Gêneros:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {filme.generos.map((genero) => (
                      <span
                        key={genero.id}
                        className="bg-secondary text-white text-xs px-2 py-1 rounded-full"
                      >
                        {genero.descricao}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm">Sem gêneros cadastrados.</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg text-textPrimary p-6">
          <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-semibold">Usuário 1</p>
              <p className="text-sm">Ótimo filme, recomendo muito!</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-semibold">Usuário 2</p>
              <p className="text-sm">Bom enredo e ótima atuação.</p>
            </div>
            <div>
              <p className="font-semibold">Usuário 3</p>
              <p className="text-sm">Esperava mais, mas foi divertido.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetails;
