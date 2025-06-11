import React, { useState } from "react";
import { LogoPrimary } from "../components/Logo";
import { User, Menu, X } from "react-feather";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HeaderCustom: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, isAdmin } = useAuth();

    return (
        <header className="flex justify-between items-center px-6 md:px-12 py-5 bg-secondary sticky top-0 z-20">
            {/*logo*/}
            <div className="flex items-center">
                <LogoPrimary size={40} />
                <h1 className="ml-2 font-bold text-textPrimary text-xl">Boscov</h1>
            </div>

            {/*icones para mobile*/}
            <div className="flex items-center gap-4 md:hidden text-textPrimary">
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/*nav desktop*/}
            <nav className="hidden md:flex items-center gap-8 text-textPrimary">
                <Link to="/" className="hover:bg-primary px-3 py-2 rounded transition">Home</Link>
                {isAdmin && ( 
                    <Link to="/admin" className="text-white hover:text-primary-light ml-4">
                        Admin
                    </Link>
                )}
                {user ? (
                    <span>Olá, <Link to="/user-profile" className="font-bold hover:underline">{user.nome}</Link></span>
                ) : (
                    <div className="flex gap-1 items-center">
                        <User size={20} className="text-textPrimary" />
                        <span>Olá, </span>
                        <Link to="/auth" className="font-bold hover:underline">Entre</Link>
                        <span> ou </span>
                        <Link to="/auth" className="font-bold hover:underline">Cadastre-se</Link>
                    </div>
                )}
            </nav>

            {/*mobile*/}
            {menuOpen && (
                <div className="fixed top-0 right-0 w-3/4 h-full bg-primary shadow-lg flex flex-col items-start p-6 gap-6 text-textPrimary md:hidden transition">
                    <button onClick={() => setMenuOpen(false)} className="self-end">
                        <X size={28} />
                    </button>

                    <div className="flex items-center border-b border-textSecondary pb-4 w-full">
                        <LogoPrimary size={40} />
                        <h1 className="ml-2 font-bold text-xl">Boscov</h1>
                    </div>

                    <Link to="/" className="hover:bg-primary px-3 py-2 rounded transition w-full">Home</Link>
                    <Link to="/user-profile" className="hover:bg-primary px-3 py-2 rounded transition w-full">Perfil</Link>
                    <Link to="/settings" className="hover:bg-primary px-3 py-2 rounded transition w-full">Configurações</Link>

                    {user ? (
                        <span>Olá, <Link to="/user-profile" className="font-bold hover:underline">{user.nome}</Link></span>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link to="/login" className="font-bold hover:underline">Entre</Link>
                            <Link to="/register" className="font-bold hover:underline">Cadastre-se</Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default HeaderCustom;
