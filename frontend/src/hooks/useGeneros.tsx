import { useCallback, useState } from 'react';
import { useAuth } from './useAuth';
import { Genero } from '../models/Genero';

export function useGeneros() {
    const { token } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createGenero = useCallback(async (descricao: string): Promise<Genero | null> => {
        setLoading(true);
        setError(null);
        try {
            if (!token) {
                throw new Error("Usuário não autenticado. Faça login para adicionar um gênero.");
            }
            if (!descricao.trim()) {
                throw new Error("A descrição do gênero não pode ser vazia.");
            }

            const response = await fetch(`${apiUrl}/genero/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ descricao }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao criar gênero: ${response.statusText}`);
            }

            const newGenero: Genero = await response.json();
            return newGenero;
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao adicionar o gênero.");
            console.error("Erro ao criar gênero:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, token]);

    const fetchAllGeneros = useCallback(async (): Promise<Genero[] | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/genero`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao buscar gêneros: ${response.statusText}`);
            }

            const generos: Genero[] = await response.json();
            return generos;
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao buscar os gêneros.");
            console.error("Erro ao buscar gêneros:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    const updateGenero = useCallback(async (id: number, descricao: string): Promise<Genero | null> => {
        setLoading(true);
        setError(null);
        try {
            if (!token) {
                throw new Error("Usuário não autenticado. Faça login para atualizar um gênero.");
            }
            if (!descricao.trim()) {
                throw new Error("A descrição do gênero não pode ser vazia.");
            }

            const response = await fetch(`${apiUrl}/genero/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ descricao }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao atualizar gênero: ${response.statusText}`);
            }

            const updatedGenero: Genero = await response.json();
            return updatedGenero;
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao atualizar o gênero.");
            console.error("Erro ao atualizar gênero:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, token]);

    const deleteGenero = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            if (!token) {
                throw new Error("Usuário não autenticado. Faça login para deletar um gênero.");
            }

            const response = await fetch(`${apiUrl}/genero/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao deletar gênero: ${response.statusText}`);
            }

            return true; 
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao deletar o gênero.");
            console.error("Erro ao deletar gênero:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, token]);


    return { createGenero, fetchAllGeneros, updateGenero, deleteGenero, loading, error };
}