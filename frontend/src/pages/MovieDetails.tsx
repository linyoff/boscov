import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Filme } from "../models/Filme";
import { useFilmes } from "../hooks/useFilmes";
import { useAuth } from "../hooks/useAuth";
import { useAvaliacoes } from "../hooks/useAvaliacoes";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/CustomButton";
import { Avaliacao } from "../models/Avaliacao";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchFilmeById } = useFilmes();
  const [filme, setFilme] = useState<Filme | null>(null);
  const [carregando, setCarregando] = useState(true);
  const { user } = useAuth();
  const {
    avaliacoes,
    fetchAvaliacoesPorFilme,
    enviarAvaliacao,
    atualizarAvaliacao,
    excluirAvaliacao,
  } = useAvaliacoes();
  const [comentario, setComentario] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [nota, setNota] = useState<number>(0);
  const [avaliacaoUsuario, setAvaliacaoUsuario] = useState<Avaliacao | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [mediaNotas, setMediaNotas] = useState<string | null>(null);

  useEffect(() => {
    if (filme?.id) {
      fetchAvaliacoesPorFilme(filme.id);
    }
  }, [filme?.id, fetchAvaliacoesPorFilme]);

  //calcular a média sempre que as avaliações mudam
  useEffect(() => {
    if (avaliacoes.length > 0) {
      const totalNotas = avaliacoes.reduce((sum, avaliacao) => sum + avaliacao.nota, 0);
      const media = totalNotas / avaliacoes.length;
      setMediaNotas(media.toFixed(1));
    } else {
      setMediaNotas(null);
    }
  }, [avaliacoes]);


  useEffect(() => {
    let isMounted = true;
    const buscarFilme = async () => {
      if (id) {
        const data = await fetchFilmeById(id);
        if (isMounted) {
          setFilme(data);
          setCarregando(false);
        }
      } else {
        setCarregando(false);
      }
    };
    buscarFilme();
    return () => {
      isMounted = false;
    };
  }, [id, fetchFilmeById]);

  useEffect(() => {
    if (user && avaliacoes.length > 0) {
      const userReview = avaliacoes.find(
        (avaliacao) => avaliacao.usuario.id === user.id
      );
      if (userReview) {
        setAvaliacaoUsuario(userReview);
      } else {
        setAvaliacaoUsuario(null);
      }
    } else {
      setAvaliacaoUsuario(null);
    }
    setComentario("");
    setNota(0);
    setShowForm(false);
    setMensagem(""); //limpa mensagem ao cancelar
  }, [avaliacoes, user]);


  const handleEditClick = () => {
    if (avaliacaoUsuario) {
      setComentario(avaliacaoUsuario.comentario);
      setNota(avaliacaoUsuario.nota);
    } else {
      setComentario("");
      setNota(0);
    }
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setComentario("");
    setNota(0);
    setShowForm(false);
    setMensagem("");
  };

  const handleExcluirAvaliacao = async () => {
    if (!filme || !user || !window.confirm("Tem certeza que deseja excluir sua avaliação?")) {
      return;
    }

    try {
      await excluirAvaliacao(filme.id);
      setMensagem("Avaliação excluída com sucesso!");
      setAvaliacaoUsuario(null);
      setComentario("");
      setNota(0);
      setShowForm(false);
      await fetchAvaliacoesPorFilme(filme.id);
    } catch (err) {
      setMensagem("Erro ao excluir avaliação.");
      console.error("Erro ao excluir avaliação:", err);
    }
    setTimeout(() => setMensagem(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !filme) return;
    if (nota < 0 || nota > 5) {
      setMensagem("Nota deve estar entre 0 e 5.");
      return;
    }

    try {
      if (avaliacaoUsuario) {
        await atualizarAvaliacao(
          filme.id,
          comentario,
          nota
        );
        setMensagem("Avaliação atualizada com sucesso!");
      } else {
        await enviarAvaliacao(filme.id, comentario, user.id, nota);
        setMensagem("Avaliação enviada com sucesso!");
      }
      setComentario("");
      setNota(0);
      setShowForm(false);
      await fetchAvaliacoesPorFilme(filme.id);
    } catch (err) {
      setMensagem("Erro ao enviar/atualizar avaliação.");
      console.error("Erro na avaliação:", err);
    }

    setTimeout(() => setMensagem(""), 3000);
  };

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
        <p className="text-xl font-semibold text-red-500">
          Filme não encontrado.
        </p>
      </div>
    );

  const avaliacoesOrdenadas = avaliacoes
    .filter((avaliacao) => avaliacao.usuario.id !== user?.id);

  const avaliacoesParaExibir = avaliacaoUsuario
    ? [avaliacaoUsuario, ...avaliacoesOrdenadas]
    : avaliacoesOrdenadas;

  return (
    <div className="flex flex-col min-h-screen bg-primary text-primary">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start w-full p-6">
        {/* Informações do filme */}
        <section className="w-full max-w-5xl bg-tertiary rounded-xl shadow-lg text-textPrimary p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src={filme.poster}
              alt={`Capa de ${filme.nome}`}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
            />

            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-4">{filme.nome}</h1>
              {/*media das notas*/}
              {mediaNotas !== null && (
                  <p className="text-xl font-bold mb-2">
                      ⭐ Média: <span className="text-secondary">{mediaNotas}</span> / 5 ({avaliacoes.length} avaliações)
                  </p>
              )}
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
        </section>

        {/*avaliações*/}
        <section className="w-full max-w-5xl rounded-xl shadow-lg text-textPrimary p-6">
          <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
          {avaliacoesParaExibir.length > 0 ? (
            <div className="space-y-4">
              {avaliacoesParaExibir.map((avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="border-b pb-2 last:border-none flex justify-between items-start"
                >
                  <div>
                    <p className="font-semibold">{avaliacao.usuario.nome}</p>
                    <p className="font-semibold">Nota: {avaliacao.nota}</p>
                    <p className="text-sm">{avaliacao.comentario}</p>
                  </div>

                  {user && avaliacao.usuario.id === user.id && (
                    <div className="flex gap-2 mt-1 md:mt-0">
                      <Button onClick={handleEditClick} className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-700">
                        Editar
                      </Button>
                      <Button onClick={handleExcluirAvaliacao} className="px-3 py-1 text-sm bg-red-500 hover:bg-red-700">
                        Excluir
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Nenhuma avaliação ainda.</p>
          )}
        </section>

        {user && !avaliacaoUsuario && !showForm && (
          <section className="w-full max-w-5xl text-center mt-6">
            <Button onClick={handleEditClick}>
              Adicionar sua Avaliação
            </Button>
          </section>
        )}

        {/*form de avaliação/edição*/}
        {user && showForm && (
          <section className="w-full max-w-5xl rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">
              {avaliacaoUsuario ? "Edite sua avaliação" : "Deixe sua avaliação"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nota (0 a 5)</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.5}
                  value={nota}
                  onChange={(e) => setNota(parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  required
                />
              </div>

              <textarea
                name="comentario"
                required
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escreva seu comentário sobre o filme..."
                className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-black"
                rows={4}
              />
              <div className="flex gap-4">
                <Button type="submit">
                  {avaliacaoUsuario ? "Atualizar Avaliação" : "Enviar Avaliação"}
                </Button>
                <Button type="button" onClick={handleCancelForm} className="bg-gray-500 hover:bg-gray-700">
                  Cancelar
                </Button>
              </div>

              {mensagem && (
                <p className="text-sm mt-2 text-center text-red-600">
                  {mensagem}
                </p>
              )}
            </form>
          </section>
        )}

        {!user && (
          <div className="w-full max-w-5xl text-textPrimary mt-6 text-center">
            <p>
              <strong>Faça login</strong> para deixar sua avaliação.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;