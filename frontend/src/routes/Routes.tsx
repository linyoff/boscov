import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import MovieDetails from "../pages/MovieDetails";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/auth" element={<Auth/>} />
            <Route path="/filme/:id" element={<MovieDetails/>} />
        </Routes>
    )
}