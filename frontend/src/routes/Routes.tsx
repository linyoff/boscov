import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import MovieDetails from "../pages/MovieDetails";
import UserProfile from "../pages/UserProfile";
import Movies from "../pages/Movies";
import Avaliacoes from "../pages/Avaliacoes";
import AdminRoute from "../components/AdminRoute";
import AdminDashboard from "../pages/AdminDashboard";
import AddGenre from "../pages/AddGenre";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/filme/:id" element={<MovieDetails />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/filmes" element={<Movies />} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />

            <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                {/* <Route path="add-usuario" element={<AddUser />} />
                <Route path="add-filme" element={<AddMovie />} /> */}
                <Route path="add-genero" element={<AddGenre />} />
            </Route>
        </Routes>
    )
}