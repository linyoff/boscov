import { useCallback, useState, useEffect } from "react";
import { Filme } from "../models/Filme";
import { useAuth } from './useAuth';

export function useFilmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const { token } = useAuth();

  const fetchAllFilmes = useCallback(async (): Promise<Filme[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

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
  }, [apiUrl, token]);

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
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login como admin para adicionar um filme.");
      }

      const response = await fetch(`${apiUrl}/filme/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
  }, [apiUrl, token]);


  const updateFilme = useCallback(async (id: number, filmeData: Omit<Filme, 'id' | 'createdAt' | 'updatedAt' | 'generos'>, generosIds: number[]): Promise<Filme | null> => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login como admin para atualizar um filme.");
      }

      const response = await fetch(`${apiUrl}/filme/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
  }, [apiUrl, token]);


  const deleteFilme = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login como admin para deletar um filme.");
      }

      const response = await fetch(`${apiUrl}/filme/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
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
  }, [apiUrl, token]);


  return { filmes, loading, error, fetchFilmeById, fetchAllFilmes, createFilme, updateFilme, deleteFilme };
}