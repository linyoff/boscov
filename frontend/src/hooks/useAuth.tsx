import { useEffect, useState } from "react";
import { Usuario, TipoUsuario } from "../models/User";

export const useAuth = () => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); 

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL;

        const loadUser = async () => {
            setIsLoading(true);

            if (storedToken && apiUrl) {
                setToken(storedToken);
                try {
                    const res = await fetch(`${apiUrl}/user/logado`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });

                    const contentType = res.headers.get("content-type");
                    const responseText = await res.text();

                    if (!res.ok) {
                        console.warn("Requisição falhou: ", res.status);
                        if (res.status === 401 || res.status === 403) {
                            localStorage.removeItem("token");
                            setUser(null);
                            setIsAdmin(false);
                        }
                    } else if (contentType && contentType.includes("application/json")) {
                        const data = JSON.parse(responseText);
                        if (data.nome) {
                            setUser(data);
                            setIsAdmin(data.tipoUsuario === TipoUsuario.ADMIN);
                        }
                    } else {
                        console.error("A resposta não é válida");
                    }
                } catch (err) {
                    console.error("Erro ao buscar usuário:", err);
                    localStorage.removeItem("token");
                    setUser(null);
                    setIsAdmin(false);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUser(null);
                setIsAdmin(false);
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const logout = async () => {
        const storedToken = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL;

        if (storedToken && apiUrl) {
            try {
                await fetch(`${apiUrl}/logout`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });
            } catch (err) {
                console.warn("Falha ao chamar /logout, prosseguindo com logout local.");
            }
        }

        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        setIsAdmin(false);
        setIsLoading(false);
        window.location.replace("/auth");
    };

    return { user, setUser, token, logout, isAdmin, isLoading };
};