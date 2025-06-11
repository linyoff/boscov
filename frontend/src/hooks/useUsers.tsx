import { useCallback, useState } from 'react';
import { useAuth } from './useAuth';
import { Usuario, TipoUsuario } from '../models/User';

export function useUsers() {
    const { token } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar todos os usuários (necessária para listar no admin)
    const fetchAllUsers = useCallback(async (): Promise<Usuario[] | null> => {
        setLoading(true);
        setError(null);
        try {
            if (!token) {
                throw new Error("Usuário não autenticado. Faça login como admin para listar usuários.");
            }

            // ASSUMINDO: Rota GET /user (ou /users) para listar todos os usuários, protegida por token
            const response = await fetch(`${apiUrl}/user`, { // Ajuste a rota se necessário (ex: /users)
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao buscar usuários: ${response.statusText}`);
            }

            const users: Usuario[] = await response.json();
            return users;
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao buscar os usuários.");
            console.error("Erro ao buscar usuários:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, token]);

    // Função para criar um novo usuário (usando a rota /register)
    const createUser = useCallback(async (userData: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Usuario | null> => {
        setLoading(true);
        setError(null);
        try {
            if (!token) { // Embora register não exija token para o usuário comum, aqui é para admin criar
                throw new Error("Usuário não autenticado. Faça login como admin para criar um usuário.");
            }

            // A rota /register geralmente não precisa de token se qualquer um pode se registrar.
            // Mas se for uma criação de admin, seu backend deve verificar o token E a permissão de admin.
            const response = await fetch(`${apiUrl}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Mantenha se o backend exigir token de admin para criar usuários
                },
                body: JSON.stringify({
                    nome: userData.nome,
                    apelido: userData.apelido,
                    email: userData.email,
                    senha: userData.senha,
                    data_nascimento: userData.data_nascimento,
                    tipoUsuario: userData.tipoUsuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao criar usuário: ${response.statusText}`);
            }

            const newUser: Usuario = await response.json();
            return newUser;
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao adicionar o usuário.");
            console.error("Erro ao criar usuário:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, token]);

    // Função para deletar um usuário
    const deleteUser = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            if (!token) {
                throw new Error("Usuário não autenticado. Faça login como admin para deletar um usuário.");
            }

            // ASSUMINDO: Rota DELETE /user/delete/:id, protegida por token
            const response = await fetch(`${apiUrl}/user/delete/${id}`, { // Ajuste a rota se necessário
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao deletar usuário: ${response.statusText}`);
            }

            return true; // Retorna true em caso de sucesso
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao deletar o usuário.");
            console.error("Erro ao deletar usuário:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [apiUrl, token]);

    return { createUser, fetchAllUsers, deleteUser, loading, error };
}