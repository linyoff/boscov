import { useCallback, useState, useEffect } from "react";
import { Filme } from "../models/Filme";

export function useFilmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchAllFilmes = useCallback(async (): Promise<Filme[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };

      const response = await fetch(`${apiUrl}/filme`, { headers });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar filmes.");
      }
      const data = await response.json();
      setFilmes(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao buscar os filmes.");
      console.error("Erro ao buscar filmes:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchAllFilmes();
  }, [fetchAllFilmes]);


  const fetchFilmeById = useCallback(async (id: string | number): Promise<Filme | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/filme/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar filme por ID.");
      }
      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);


  const createFilme = useCallback(async (filmeData: Omit<Filme, 'id' | 'createdAt' | 'updatedAt' | 'generos'>, generosIds: number[]): Promise<Filme | null> => {
    setLoading(true);
    setError(null);
    try {

      const response = await fetch(`${apiUrl}/filme/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...filmeData, generos: generosIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao criar filme: ${response.statusText}`);
      }

      const newFilme: Filme = await response.json();
      return newFilme;
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao adicionar o filme.");
      console.error("Erro ao criar filme:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]); 

  const updateFilme = useCallback(async (id: number, filmeData: Omit<Filme, 'id' | 'createdAt' | 'updatedAt' | 'generos'>, generosIds: number[]): Promise<Filme | null> => {
    setLoading(true);
    setError(null);
    try {
     const response = await fetch(`${apiUrl}/filme/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...filmeData, generos: generosIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao atualizar filme: ${response.statusText}`);
      }

      const updatedFilme: Filme = await response.json();
      return updatedFilme;
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao atualizar o filme.");
      console.error("Erro ao atualizar filme:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]); 


  const deleteFilme = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
const response = await fetch(`${apiUrl}/filme/delete/${id}`, {
        method: 'DELETE',
        headers: {
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao deletar filme: ${response.statusText}`);
      }

      return true;
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao deletar o filme.");
      console.error("Erro ao deletar filme:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiUrl]); 


  return { filmes, loading, error, fetchFilmeById, fetchAllFilmes, createFilme, updateFilme, deleteFilme };
}