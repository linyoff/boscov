import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import MovieDetails from "../pages/MovieDetails";
import UserProfile from "../pages/UserProfile";
import Movies from "../pages/Movies";
import Avaliacoes from "../pages/Avaliacoes";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/auth" element={<Auth/>} />
            <Route path="/filme/:id" element={<MovieDetails/>} />
            <Route path="/user-profile" element={<UserProfile/>} />
            <Route path="/filmes" element={<Movies/>} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />
        </Routes>
    )
}