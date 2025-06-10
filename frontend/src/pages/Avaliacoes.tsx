import React, { useEffect, useState } from "react";
import { Filme } from "../models/Filme";
import axios from "axios";
import FilmeCard from "../components/FilmeCard";
import { useAuth } from "../hooks/useAuth";
import HeaderCustom from "../components/Header";
import Footer from "../components/Footer";

const Avaliacoes: React.FC = () => {
    const { user, token } = useAuth();
    const [filmesAvaliados, setFilmesAvaliados] = useState<Filme[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilmesAvaliados = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/avaliacoes/user/${user?.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                //supondo que cada avaliação tem um campo "filme"
                const filmes = res.data.map((avaliacao: any) => avaliacao.filme);
                setFilmesAvaliados(filmes);
            } catch (error) {
                console.error("Erro ao buscar avaliações do usuário", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchFilmesAvaliados();
        }
    }, [user, token]);

    return (
        <div className="flex flex-col min-h-screen bg-primary text-primary">
            <HeaderCustom />
            <h1 className="text-2xl font-bold text-center sm:text-left mb-6">
                Filmes avaliados por você
            </h1>

            {loading ? (
                <p className="text-center text-textSecondary">Carregando avaliações...</p>
            ) : filmesAvaliados.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                    {filmesAvaliados.map((filme) => (
                        <FilmeCard key={filme.id} filme={filme} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-textSecondary">
                    Você ainda não avaliou nenhum filme.
                </p>
            )}

            <Footer />
        </div>
    );
};

export default Avaliacoes;
