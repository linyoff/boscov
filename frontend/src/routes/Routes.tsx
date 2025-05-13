import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/te" element={<Home/>} />
            <Route path="/" element={<Auth/>} />
        </Routes>
    )
}