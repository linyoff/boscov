import { useState, useEffect } from "react";
import { Filme } from "../models/Filme";

export function useFilmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchFilmes() {
      try {
        const response = await fetch(`${apiUrl}/filme`);
        if (!response.ok) throw new Error("Erro ao buscar filmes");
        const data = await response.json();
        setFilmes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFilmes();
  }, []);

  //buscar filme por id
  const fetchFilmeById = async (id: string | number): Promise<Filme | null> => {
    try {
      const response = await fetch(`${apiUrl}/filme/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar filme");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { filmes, loading, error, fetchFilmeById };
}
