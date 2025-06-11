import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-primary text-primary">
            <Header />
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-8">Painel de Administração</h1>

                <p className="text-lg mb-6">Selecione uma opção para gerenciar:</p>

                <nav className="flex flex-col gap-4">
                    <Link
                        to="/admin/add-filme"
                        className="bg-secondary hover:bg-tertiary text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors text-lg text-center"
                    >
                        Adicionar Novo Filme
                    </Link>
                    <Link
                        to="/admin/add-genero"
                        className="bg-secondary hover:bg-tertiary text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors text-lg text-center"
                    >
                        Adicionar Novo Gênero
                    </Link>
                    <Link
                        to="/admin/add-usuario"
                        className="bg-secondary hover:bg-tertiary text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors text-lg text-center"
                    >
                        Adicionar Novo Usuário Admin
                    </Link>
                    
                </nav>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;