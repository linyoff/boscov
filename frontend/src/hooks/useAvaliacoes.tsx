import { useState } from "react";
import { Avaliacao } from "../models/Avaliacao";

export function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchAvaliacoesPorFilme = async (filmeId: number) => {
    try {
      const res = await fetch(`${apiUrl}/avaliacao/filme/${filmeId}`);
      const data = await res.json();
      setAvaliacoes(data);
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    }
  };

  const enviarAvaliacao = async (idFilme: number, comentario: string, idUsuario: number, nota: number) => {
    const res = await fetch(`${apiUrl}/avaliacao/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idUsuario, idFilme, nota, comentario, }),
    });

    if (!res.ok) {
      throw new Error("Erro ao enviar avaliação.");
    }

    const nova = await res.json();
    setAvaliacoes((prev) => [...prev, nova]);
  };

  return { avaliacoes, fetchAvaliacoesPorFilme, enviarAvaliacao };
}
