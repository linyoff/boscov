import { useEffect, useState } from "react";

export enum TipoUsuario {
    COMUM = "COMUM",
    ADMIN = "ADMIN"
}

export interface User {
    id: number;
    nome: string;
    apelido?: string;
    email: string;
    senha: string;
    data_nascimento: Date;
    tipoUsuario: TipoUsuario;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL;

        if (token && apiUrl) {
            setToken(token);

            fetch(`${apiUrl}/user/logado`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(async (res) => {
                    const contentType = res.headers.get("content-type");
                    const responseText = await res.text();

                    if (!res.ok) {
                        console.warn("Requisição falhou: ", res.status);
                        if (res.status === 401 || res.status === 403) {
                            localStorage.removeItem("token");
                            setUser(null);
                        }
                        return;
                    }

                    if (contentType && contentType.includes("application/json")) {
                        const data = JSON.parse(responseText);
                        if (data.name) {
                            setUser(data);
                        }
                    } else {
                        console.error("A resposta não é válida");
                    }
                })
                .catch((err) => console.error("Erro ao buscar usuário:", err));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        window.location.href = "/login";
    };

    return { user, setUser, token, logout };
};
