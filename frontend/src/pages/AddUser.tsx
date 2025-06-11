import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/CustomButton';
import { useUsers } from '../hooks/useUsers';
import { Usuario, TipoUsuario } from '../models/User';

const AddUser: React.FC = () => {

    const [nome, setNome] = useState('');
    const [apelido, setApelido] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>(TipoUsuario.COMUM); //default COMUM
    const [status, setStatus] = useState(true);
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [users, setUsers] = useState<Usuario[]>([]);
    const [listLoading, setListLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);

    const { createUser, fetchAllUsers, deleteUser, loading: formLoading, error: formError } = useUsers();

    useEffect(() => {
        const loadUsers = async () => {
            setListLoading(true);
            setListError(null);
            try {
                const fetchedUsers = await fetchAllUsers();
                if (fetchedUsers) {
                    setUsers(fetchedUsers);
                } else {
                    setUsers([]);
                }
            } catch (err: any) {
                setListError(err.message || "Erro ao carregar lista de usuários.");
                console.error("Erro ao carregar lista de usuários:", err);
            } finally {
                setListLoading(false);
            }
        };
        loadUsers();
    }, [fetchAllUsers]);

    const refreshUsers = async () => {
        setListLoading(true);
        setListError(null);
        try {
            const fetchedUsers = await fetchAllUsers();
            if (fetchedUsers) {
                setUsers(fetchedUsers);
            }
        } catch (err: any) {
            setListError(err.message || "Erro ao recarregar lista de usuários.");
            console.error("Erro ao recarregar lista de usuários:", err);
        } finally {
            setListLoading(false);
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem(null);

        //validações do form
        if (!nome.trim() || !email.trim() || !senha.trim() || !dataNascimento.trim()) {
            setMensagem("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const userData = {
                nome,
                apelido: apelido || undefined,
                email,
                senha,
                data_nascimento: new Date(dataNascimento),
                tipoUsuario,
                status,
            };

            const newUser = await createUser(userData);
            if (newUser) {
                setMensagem(`Usuário "${newUser.nome}" (${newUser.email}) adicionado com sucesso!`);
                //limpar form após sucesso
                setNome('');
                setApelido('');
                setEmail('');
                setSenha('');
                setDataNascimento('');
                setTipoUsuario(TipoUsuario.COMUM);
                setStatus(true);
                await refreshUsers();
            } else if (formError) {
                setMensagem(`Erro: ${formError}`);
            }
        } catch (err: any) {
            setMensagem(`Erro ao adicionar usuário: ${err.message || 'Verifique o console.'}`);
        }

        setTimeout(() => setMensagem(null), 5000);
    };

    const handleDeleteClick = async (id: number, nomeUsuario: string) => {
        if (!window.confirm(`Tem certeza que deseja excluir o usuário "${nomeUsuario}"?`)) {
            return;
        }
        setMensagem(null);
        try {
            const success = await deleteUser(id);
            if (success) {
                setMensagem(`Usuário "${nomeUsuario}" excluído com sucesso!`);
                await refreshUsers();
            } else if (formError) {
                setMensagem(`Erro ao excluir: ${formError}`);
            }
        } catch (err: any) {
            setMensagem(`Erro ao excluir usuário: ${err.message || 'Verifique o console.'}`);
        }
        setTimeout(() => setMensagem(null), 5000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary text-primary">
            <Header />
            <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-8 text-center">Gerenciar Usuários</h1>

                {/*form de add de usuario*/}
                <section className="bg-tertiary p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">Adicionar Novo Usuário</h2>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium mb-2">Nome:</label>
                                <input
                                    type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)}
                                    placeholder="Nome completo" required
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black"
                                />
                            </div>
                            <div>
                                <label htmlFor="apelido" className="block text-sm font-medium mb-2">Apelido (opcional):</label>
                                <input
                                    type="text" id="apelido" value={apelido} onChange={(e) => setApelido(e.target.value)}
                                    placeholder="Apelido"
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">Email:</label>
                                <input
                                    type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com" required
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black"
                                />
                            </div>
                            <div>
                                <label htmlFor="senha" className="block text-sm font-medium mb-2">Senha:</label>
                                <input
                                    type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Mínimo 6 caracteres" required
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black"
                                />
                            </div>
                            <div>
                                <label htmlFor="dataNascimento" className="block text-sm font-medium mb-2">Data de Nascimento:</label>
                                <input
                                    type="date" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)}
                                    required
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black"
                                />
                            </div>
                            <div>
                                <label htmlFor="tipoUsuario" className="block text-sm font-medium mb-2">Tipo de Usuário:</label>
                                <select
                                    id="tipoUsuario" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value as TipoUsuario)}
                                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-transparent text-black"
                                >
                                    <option value={TipoUsuario.COMUM}>Comum</option>
                                    <option value={TipoUsuario.ADMIN}>Admin</option>
                                </select>
                            </div>
                            <div className="col-span-1 md:col-span-2 flex items-center">
                                <input
                                    type="checkbox" id="status" checked={status} onChange={(e) => setStatus(e.target.checked)}
                                    className="mr-2 h-4 w-4 text-secondary rounded focus:ring-secondary"
                                />
                                <label htmlFor="status" className="text-sm font-medium">Usuário Ativo</label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-secondary hover:bg-opacity-80 py-3 font-semibold text-lg"
                        >
                            {formLoading ? 'Adicionando...' : 'Adicionar Usuário'}
                        </Button>

                        {mensagem && (
                            <p className={`mt-4 text-center ${formError ? 'text-red-500' : 'text-green-500'}`}>
                                {mensagem}
                            </p>
                        )}
                    </form>
                </section>

                {/*lista de usuarios*/}
                <section className="bg-tertiary p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Usuários Cadastrados</h2>
                    {listLoading ? (
                        <p className="text-center text-textSecondary">Carregando usuários...</p>
                    ) : users.length === 0 ? (
                        <p className="text-center text-textSecondary">Nenhum usuário cadastrado ainda.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">ID</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">Nome</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">Email</th>
                                        <th className="py-2 px-4 text-left text-sm font-semibold">Tipo</th>
                                        <th className="py-2 px-4 text-center text-sm font-semibold">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((userItem) => (
                                        <tr key={userItem.id} className="border-b border-gray-200 last:border-none">
                                            <td className="py-2 px-4 text-sm">{userItem.id}</td>
                                            <td className="py-2 px-4 text-sm">{userItem.nome} ({userItem.apelido})</td>
                                            <td className="py-2 px-4 text-sm">{userItem.email}</td>
                                            <td className="py-2 px-4 text-sm">{userItem.tipoUsuario}</td>
                                            <td className="py-2 px-4 text-center">
                                                <Button
                                                    onClick={() => handleDeleteClick(userItem.id, userItem.nome)}
                                                    className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600"
                                                >
                                                    Excluir
                                                </Button>
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

export default AddUser;