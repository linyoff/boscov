import { useCallback, useState } from "react";
import { Avaliacao } from "../models/Avaliacao";
import { useAuth } from "./useAuth";

export function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [avaliacoesUsuario, setAvaliacoesUsuario] = useState<Avaliacao[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const { user, token } = useAuth();

  const fetchAvaliacoesPorFilme = useCallback(async (filmeId: number) => {
    try {
      const res = await fetch(`${apiUrl}/avaliacao/filme/${filmeId}`);
      if (!res.ok) {
        throw new Error(`Erro ao buscar avaliações: ${res.statusText}`);
      }
      const data = await res.json();
      setAvaliacoes(data);
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    }
  }, [apiUrl]);

  const fetchAvaliacoesPorUsuario = useCallback(
    async (idUsuario: number) => {
      if (!token) {
        throw new Error("Usuário não autenticado. Impossível buscar avaliações.");
      }
      if (!apiUrl) {
        throw new Error("URL da API não configurada.");
      }

      try {
        const res = await fetch(`${apiUrl}/avaliacao/usuario/${idUsuario}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erro ao buscar avaliações do usuário.");
        }

        const data: Avaliacao[] = await res.json();
        setAvaliacoesUsuario(data);
        return data;
      } catch (error) {
        console.error("Erro ao buscar avaliações por usuário:", error);
        throw error;
      }
    },
    [apiUrl, token]
  );

  const enviarAvaliacao = useCallback(
    async (idFilme: number, comentario: string, idUsuario: number, nota: number) => {

      if (!token) {
        throw new Error("Usuário não autenticado. Impossível enviar avaliação.");
      }

      const res = await fetch(`${apiUrl}/avaliacao/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idUsuario, idFilme, nota, comentario }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao enviar avaliação.");
      }

      const nova = await res.json();

      return nova;
    },
    [apiUrl, token]
  );

  const atualizarAvaliacao = useCallback(

    async (idFilme: number, comentario: string, nota: number) => {
      if (!user || !token) {
        throw new Error("Usuário não autenticado.");
      }
      if (!apiUrl) {
        throw new Error("URL da API não configurada.");
      }

      try {

        const res = await fetch(`${apiUrl}/avaliacao/update/${user.id}/${idFilme}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comentario, nota }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erro ao atualizar avaliação.");
        }

        const avaliacaoAtualizada = await res.json();
        return avaliacaoAtualizada;
      } catch (error) {
        console.error("Erro ao atualizar avaliação:", error);
        throw error;
      }
    },

    [apiUrl, user, token]
  );

  const excluirAvaliacao = useCallback(
    async (idFilme: number) => {
      if (!user || !token) {
        throw new Error("Usuário não autenticado. Impossível excluir avaliação.");
      }
      if (!apiUrl) {
        throw new Error("URL da API não configurada.");
      }

      try {
        const res = await fetch(`${apiUrl}/avaliacao/delete/${user.id}/${idFilme}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Erro ao excluir avaliação.");
        }

        return true;

      } catch (error) {
        console.error("Erro ao excluir avaliação:", error);
        throw error;
      }
    },
    [apiUrl, user, token]
  );

  return {
    avaliacoes,
    avaliacoesUsuario,
    fetchAvaliacoesPorFilme,
    fetchAvaliacoesPorUsuario,
    enviarAvaliacao,
    atualizarAvaliacao,
    excluirAvaliacao,
  };
}