import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Carteira from "./pages/Carteira";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RendaVariavel from "./pages/RendaVariavel";

export function Router() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro /> } />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/carteira" element={<Carteira />}/>
        <Route path="/renda-variavel" element={<RendaVariavel />} />
    </Routes>
  );
}