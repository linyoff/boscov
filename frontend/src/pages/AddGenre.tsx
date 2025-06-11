import React, { useState, useEffect } from 'react'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/CustomButton';
import { useGeneros } from '../hooks/useGeneros';
import { Genero } from '../models/Genero';

const AddGenre: React.FC = () => {
    const [descricao, setDescricao] = useState('');
    const [mensagem, setMensagem] = useState<string | null>(null);
    const { createGenero, fetchAllGeneros, updateGenero, deleteGenero, loading, error } = useGeneros();

    const [generos, setGeneros] = useState<Genero[]>([]); 
    const [editingGenre, setEditingGenre] = useState<Genero | null>(null); 

    useEffect(() => {
        const loadGeneros = async () => {
            const fetchedGeneros = await fetchAllGeneros();
            if (fetchedGeneros) {
                setGeneros(fetchedGeneros);
            }
        };
        loadGeneros();
    }, [fetchAllGeneros]); 

    const refreshGeneros = async () => {
        const fetchedGeneros = await fetchAllGeneros();
        if (fetchedGeneros) {
            setGeneros(fetchedGeneros);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem(null);

        if (!descricao.trim()) {
            setMensagem("Por favor, preencha a descrição do gênero.");
            return;
        }

        try {
            if (editingGenre) {
                const updatedGenre = await updateGenero(editingGenre.id, descricao);
                if (updatedGenre) {
                    setMensagem(`Gênero "${updatedGenre.descricao}" atualizado com sucesso!`);
                    setEditingGenre(null); 
                    setDescricao(''); 
                    await refreshGeneros();
                } else if (error) {
                    setMensagem(`Erro ao atualizar: ${error}`);
                }
            } else {
                const newGenre = await createGenero(descricao);
                if (newGenre) {
                    setMensagem(`Gênero "${newGenre.descricao}" adicionado com sucesso!`);
                    setDescricao('');
                    await refreshGeneros();
                } else if (error) {
                    setMensagem(`Erro ao adicionar: ${error}`);
                }
            }
        } catch (err: any) {
            setMensagem(`Erro na operação: ${err.message || 'Verifique o console.'}`);
        }

        setTimeout(() => setMensagem(null), 5000);
    };

    const handleEditClick = (genero: Genero) => {
        setEditingGenre(genero);
        setDescricao(genero.descricao);
        setMensagem(null);
    };

    const handleCancelEdit = () => {
        setEditingGenre(null);
        setDescricao('');
        setMensagem(null);
    };

    const handleDeleteClick = async (id: number, descricaoGenero: string) => {
        if (!window.confirm(`Tem certeza que deseja excluir o gênero "${descricaoGenero}"?`)) {
            return;
        }
        setMensagem(null);
        try {
            const success = await deleteGenero(id);
            if (success) {
                setMensagem(`Gênero "${descricaoGenero}" excluído com sucesso!`);
                await refreshGeneros(); 
            } else if (error) {
                setMensagem(`Erro ao excluir: ${error}`);
            }
        } catch (err: any) {
            setMensagem(`Erro ao excluir gênero: ${err.message || 'Verifique o console.'}`);
        }
        setTimeout(() => setMensagem(null), 5000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary text-textPrimary">
            <Header />
            <main className="flex-1 p-6 max-w-2xl mx-auto w-full"> 
                <h1 className="text-3xl font-bold mb-8 text-center">Gerenciar Gêneros</h1>

                {/*formu de add/update*/}
                <section className="bg-tertiary p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        {editingGenre ? 'Editar Gênero' : 'Adicionar Novo Gênero'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium mb-2">
                                Descrição do Gênero:
                            </label>
                            <input
                                type="text"
                                id="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Ex: Ação, Comédia, Drama..."
                                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black"
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="w-full bg-secondary hover:bg-opacity-80 py-3 font-semibold text-lg"
                            >
                                {loading ? 'Processando...' : (editingGenre ? 'Atualizar Gênero' : 'Adicionar Gênero')}
                            </Button>
                            {editingGenre && (
                                <Button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="w-full bg-gray-500 hover:bg-gray-700 py-3 font-semibold text-lg"
                                >
                                    Cancelar Edição
                                </Button>
                            )}
                        </div>

                        {mensagem && (
                            <p className={`mt-4 text-center ${error ? 'text-red-500' : 'text-green-500'}`}>
                                {mensagem}
                            </p>
                        )}
                    </form>
                </section>

                {/*lista com todos os gêneros*/}
                <section className="bg-tertiary p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Gêneros Cadastrados</h2>
                    {loading && generos.length === 0 ? (
                        <p className="text-center text-textSecondary">Carregando gêneros...</p>
                    ) : generos.length === 0 ? (
                        <p className="text-center text-textSecondary">Nenhum gênero cadastrado ainda.</p>
                    ) : (
                        <div className="overflow-x-auto"> 
                            <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">ID</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">Descrição</th>
                                        <th className="py-2 px-4 text-center text-sm font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generos.map((genero) => (
                                        <tr key={genero.id} className="border-b border-gray-200 last:border-none">
                                            <td className="py-2 px-4 text-sm">{genero.id}</td>
                                            <td className="py-2 px-4 text-sm">{genero.descricao}</td>
                                            <td className="py-2 px-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        onClick={() => handleEditClick(genero)}
                                                        className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteClick(genero.id, genero.descricao)}
                                                        className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600"
                                                    >
                                                        Excluir
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AddGenre;