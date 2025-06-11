// pages/Avaliacoes.tsx (código completo, agora usando o hook)

import React, { useEffect, useState } from "react";
import { Filme } from "../models/Filme";
import FilmeCard from "../components/FilmeCard";
import { useAuth } from "../hooks/useAuth";
import { useAvaliacoes } from "../hooks/useAvaliacoes";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";
import { Navigate } from "react-router-dom";

const Avaliacoes: React.FC = () => {
    const { user, token, isLoading } = useAuth();
    const { avaliacoesUsuario, fetchAvaliacoesPorUsuario } = useAvaliacoes();
    const [filmesAvaliados, setFilmesAvaliados] = useState<Filme[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    console.log("Avaliacoes Component Render - isLoading:", isLoading, "user:", user);

    useEffect(() => {
        const loadUserEvaluatedFilms = async () => { // Renomeada a função para clareza
            setLoadingData(true);
            try {
                if (user?.id) { // fetchAvaliacoesPorUsuario já lida com o token
                    console.log(`Fetching evaluations for user: ${user.id}`);
                    const fetchedAvaliacoes = await fetchAvaliacoesPorUsuario(user.id); // CHAMA A FUNÇÃO DO HOOK

                    console.log("Fetched Avaliacoes from hook:", fetchedAvaliacoes);

                    const filmesUnicos: Filme[] = [];
                    const filmeIds = new Set<number>();

                    fetchedAvaliacoes.forEach((avaliacao) => { // Usa os dados retornados pelo hook
                        console.log("Processing evaluation:", avaliacao);
                        if (avaliacao.filme) {
                            console.log("Found film in evaluation:", avaliacao.filme);
                            if (!filmeIds.has(avaliacao.filme.id)) {
                                filmesUnicos.push(avaliacao.filme);
                                filmeIds.add(avaliacao.filme.id);
                            } else {
                                console.log(`Skipping duplicate film: ${avaliacao.filme.nome}`);
                            }
                        } else {
                            console.warn("Evaluation missing 'filme' object:", avaliacao);
                        }
                    });

                    console.log("Final unique films to display:", filmesUnicos);
                    setFilmesAvaliados(filmesUnicos);
                } else {
                    console.log("Not fetching: user ID missing.", { user, token });
                    setFilmesAvaliados([]);
                }
            } catch (error) {
                console.error("Erro ao buscar avaliações do usuário", error);
            } finally {
                setLoadingData(false);
            }
        };

        if (!isLoading && user?.id) { // Só busca se o useAuth terminou de carregar e o user existe
            loadUserEvaluatedFilms();
        }
    }, [user, isLoading, fetchAvaliacoesPorUsuario]); // Dependências: user, isLoading e a função do hook


    // --- Proteção da rota: Garante que o usuário esteja logado ---
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-primary text-white">
                <p className="text-xl font-semibold animate-pulse">Carregando perfil de usuário...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-primary text-primary">
            <HeaderCustom />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-center sm:text-left mb-8">
                    Filmes Avaliados por Você
                </h1>

                {loadingData ? (
                    <p className="text-center text-textSecondary text-lg">Carregando seus filmes avaliados...</p>
                ) : filmesAvaliados.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                        {filmesAvaliados.map((filme) => (
                            <FilmeCard key={filme.id} filme={filme} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-textSecondary text-lg">
                        Você ainda não avaliou nenhum filme. <br /> Comece a explorar e deixar suas opiniões!
                    </p>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Avaliacoes;