import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import Cadastro from "./assets/pages/Cadastro";
import Carteira from "./assets/pages/Carteira";
import Dashboard from "./assets/pages/Dashboard";
import Login from "./assets/pages/Login";
import RendaVariavel from "./assets/pages/RendaVariavel";

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