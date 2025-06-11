import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
    children?: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {

    const { user, isAdmin, token, isLoading } = useAuth();

    console.log("AdminRoute - isLoading:", isLoading); 
    console.log("AdminRoute - user:", user);
    console.log("AdminRoute - isAdmin:", isAdmin);
    console.log("AdminRoute - token:", token);

    if (isLoading) {
        console.log("AdminRoute: Autenticação ainda carregando...");
        return <div className="flex items-center justify-center h-screen bg-primary text-white">Carregando permissões...</div>;
    }

    if (!token) { 
        console.log("AdminRoute: Redirecionando para /auth (sem token após carregamento)");
        return <Navigate to="/auth" replace />;
    }

    if (user && !isAdmin) {
        console.log("AdminRoute: Redirecionando para / (usuário não é admin após carregamento)");
        return <Navigate to="/" replace />;
    }

    console.log("AdminRoute: Acesso Permitido. Renderizando conteúdo.");
    return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;