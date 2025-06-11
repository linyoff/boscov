import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/CustomButton';
import { useFilmes } from '../hooks/useFilmes';
import { useGeneros } from '../hooks/useGeneros';
import { Filme } from '../models/Filme';
import { Genero } from '../models/Genero';

const AddMovies: React.FC = () => {

    const [idFilme, setIdFilme] = useState<number | null>(null);
    const [nome, setNome] = useState('');
    const [anoLancamento, setAnoLancamento] = useState<number>(0);
    const [duracao, setDuracao] = useState<number>(0);
    const [diretor, setDiretor] = useState('');
    const [produtora, setProdutora] = useState('');
    const [classificacao, setClassificacao] = useState('');
    const [poster, setPoster] = useState('');
    const [selectedGeneros, setSelectedGeneros] = useState<number[]>([]);
    const [mensagem, setMensagem] = useState<string | null>(null);

    const {
        filmes, loading: filmesLoading, error: filmesError,
        fetchAllFilmes, createFilme, updateFilme, deleteFilme
    } = useFilmes();
    const {
        fetchAllGeneros, loading: generosLoading, error: generosError
    } = useGeneros();

    const [allGeneros, setAllGeneros] = useState<Genero[]>([]); //todos os gêneros disponíveis
    const [listLoading, setListLoading] = useState(true); 
    const [listError, setListError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setListLoading(true);
            setListError(null);
            try {
                await fetchAllFilmes(); //carrega filmes
                const fetchedGeneros = await fetchAllGeneros(); //carrega gêneros
                if (fetchedGeneros) {
                    setAllGeneros(fetchedGeneros);
                }
            } catch (err: any) {
                setListError(err.message || "Erro ao carregar dados.");
                console.error("Erro ao carregar dados para ManageMovies:", err);
            } finally {
                setListLoading(false);
            }
        };
        loadData();
    }, [fetchAllFilmes, fetchAllGeneros]);

    const resetForm = () => {
        setIdFilme(null);
        setNome('');
        setAnoLancamento(0);
        setDuracao(0);
        setDiretor('');
        setProdutora('');
        setClassificacao('');
        setPoster('');
        setSelectedGeneros([]); 
        setMensagem(null);
    };

    const handleGeneroCheckboxChange = (generoId: number, isChecked: boolean) => {
        setSelectedGeneros(prevSelected => {
            if (isChecked) {
                return [...prevSelected, generoId];
            } else {
                //remove o id do gênero se estiver desmarcado
                return prevSelected.filter(id => id !== generoId);
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem(null);
        if (!nome.trim() || !diretor.trim() || !poster.trim() || anoLancamento <= 0 || duracao <= 0) {
            setMensagem("Por favor, preencha todos os campos obrigatórios corretamente.");
            return;
        }

        //validar que pelo menos um gênero foi selecionado
        if (selectedGeneros.length === 0) {
            setMensagem("Por favor, selecione pelo menos um gênero para o filme.");
            return;
        }

        const filmeData = {
            nome,
            anoLancamento,
            duracao,
            diretor,
            produtora,
            classificacao,
            poster,
        };

        try {
            let resultFilme: Filme | null = null;
            if (idFilme) {
                resultFilme = await updateFilme(idFilme, filmeData, selectedGeneros);
                if (resultFilme) {
                    setMensagem(`Filme "${resultFilme.nome}" atualizado com sucesso!`);
                }
            } else {
                resultFilme = await createFilme(filmeData, selectedGeneros);
                if (resultFilme) {
                    setMensagem(`Filme "${resultFilme.nome}" adicionado com sucesso!`);
                }
            }

            if (resultFilme) {
                resetForm();
                await fetchAllFilmes();
            } else if (filmesError) {
                setMensagem(`Erro na operação: ${filmesError}`);
            }
        } catch (err: any) {
            setMensagem(`Erro na operação: ${err.message || 'Verifique o console.'}`);
            console.error("Erro na operação de filme:", err);
        }

        setTimeout(() => setMensagem(null), 5000);
    };

    const handleEditClick = (filme: Filme) => {
        setIdFilme(filme.id);
        setNome(filme.nome);
        setAnoLancamento(filme.anoLancamento);
        setDuracao(filme.duracao);
        setDiretor(filme.diretor);
        setProdutora(filme.produtora);
        setClassificacao(filme.classificacao);
        setPoster(filme.poster);
        setSelectedGeneros(filme.generos?.map(g => g.id) || []);
        setMensagem(null);
    };

    const handleDeleteClick = async (id: number, nomeFilme: string) => {
        if (!window.confirm(`Tem certeza que deseja excluir o filme "${nomeFilme}"?`)) {
            return;
        }
        setMensagem(null);
        try {
            const success = await deleteFilme(id);
            if (success) {
                setMensagem(`Filme "${nomeFilme}" excluído com sucesso!`);
                await fetchAllFilmes();
                if (idFilme === id) {
                    resetForm();
                }
            } else if (filmesError) {
                setMensagem(`Erro ao excluir: ${filmesError}`);
            }
        } catch (err: any) {
            setMensagem(`Erro ao excluir filme: ${err.message || 'Verifique o console.'}`);
            console.error("Erro ao excluir filme:", err);
        }
        setTimeout(() => setMensagem(null), 5000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary text-textPrimary">
            <Header />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-8 text-center">Gerenciar Filmes</h1>

                <section className="bg-tertiary p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        {idFilme ? 'Editar Filme' : 'Adicionar Novo Filme'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium mb-2">Nome:</label>
                                <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)}
                                    placeholder="Nome do filme" required
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label htmlFor="anoLancamento" className="block text-sm font-medium mb-2">Ano de Lançamento:</label>
                                <input type="number" id="anoLancamento" value={anoLancamento || ''} onChange={(e) => setAnoLancamento(parseInt(e.target.value) || 0)}
                                    placeholder="Ano" required
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label htmlFor="duracao" className="block text-sm font-medium mb-2">Duração (minutos):</label>
                                <input type="number" id="duracao" value={duracao || ''} onChange={(e) => setDuracao(parseInt(e.target.value) || 0)}
                                    placeholder="Duração em minutos" required
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label htmlFor="diretor" className="block text-sm font-medium mb-2">Diretor:</label>
                                <input type="text" id="diretor" value={diretor} onChange={(e) => setDiretor(e.target.value)}
                                    placeholder="Nome do diretor" required
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label htmlFor="produtora" className="block text-sm font-medium mb-2">Produtora:</label>
                                <input type="text" id="produtora" value={produtora} onChange={(e) => setProdutora(e.target.value)}
                                    placeholder="Nome da produtora"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black" />
                            </div>
                            <div>
                                <label htmlFor="classificacao" className="block text-sm font-medium mb-2">Classificação:</label>
                                <input type="text" id="classificacao" value={classificacao} onChange={(e) => setClassificacao(e.target.value)}
                                    placeholder="Ex: Livre, 12, 14, 16, 18"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="poster" className="block text-sm font-medium mb-2">URL do Poster:</label>
                                <input type="url" id="poster" value={poster} onChange={(e) => setPoster(e.target.value)}
                                    placeholder="URL da imagem do poster" required
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black" />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Gêneros:</label>
                                {generosLoading ? (
                                    <p className="text-textSecondary">Carregando gêneros...</p>
                                ) : allGeneros.length === 0 ? (
                                    <p className="text-textSecondary">Nenhum gênero disponível. Adicione gêneros primeiro.</p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border border-gray-300 rounded-md bg-white text-black">
                                        {allGeneros.map(gen => (
                                            <label key={gen.id} className="inline-flex items-center text-sm">
                                                <input
                                                    type="checkbox"
                                                    value={gen.id}
                                                    checked={selectedGeneros.includes(gen.id)}
                                                    onChange={(e) => handleGeneroCheckboxChange(gen.id, e.target.checked)}
                                                    className="form-checkbox h-4 w-4 text-secondary rounded focus:ring-secondary"
                                                />
                                                <span className="ml-2">{gen.descricao}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {generosError && <p className="text-red-500 text-sm mt-1">{generosError}</p>}
                            </div>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Button
                                type="submit"

                                className="w-full bg-secondary hover:bg-opacity-80 py-3 font-semibold text-lg"
                            >
                                {filmesLoading ? 'Processando...' : (idFilme ? 'Atualizar Filme' : 'Adicionar Filme')}
                            </Button>
                            {idFilme && (
                                <Button
                                    type="button"
                                    onClick={resetForm}
                                    className="w-full bg-gray-500 hover:bg-gray-700 py-3 font-semibold text-lg"
                                >
                                    Cancelar Edição
                                </Button>
                            )}
                        </div>

                        {mensagem && (
                            <p className={`mt-4 text-center ${filmesError ? 'text-red-500' : 'text-green-500'}`}>
                                {mensagem}
                            </p>
                        )}
                    </form>
                </section>

                <section className="bg-tertiary p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Filmes Cadastrados</h2>
                    {listLoading ? (
                        <p className="text-center text-textSecondary">Carregando filmes...</p>
                    ) : filmes.length === 0 ? (
                        <p className="text-center text-textSecondary">Nenhum filme cadastrado ainda.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">ID</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">Poster</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">Nome</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">Ano</th>
                                        <th className="py-2 px-4 text-center text-sm font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filmes.map((filme) => (
                                        <tr key={filme.id} className="border-b border-gray-200 last:border-none">
                                            <td className="py-2 px-4 text-sm">{filme.id}</td>
                                            <td className="py-2 px-4 text-sm">
                                                {filme.poster ? (
                                                    <img src={filme.poster} alt={filme.nome} className="w-12 h-16 object-cover rounded" />
                                                ) : (
                                                    <span>N/A</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-4 text-sm">{filme.nome}</td>
                                            <td className="py-2 px-4 text-sm">{filme.anoLancamento}</td>
                                            <td className="py-2 px-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        onClick={() => handleEditClick(filme)}
                                                        className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteClick(filme.id, filme.nome)}
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

export default AddMovies;