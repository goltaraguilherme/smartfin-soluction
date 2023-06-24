import { Fragment, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import Fii from "./components/RendaVariavel/Fii";
import FiiDetalhes from "./components/RendaVariavel/FiiDetalhes";
import Cadastro from "./pages/Cadastro";
import Carteira from "./pages/Carteira";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RendaVariavel, { FiiData } from "./pages/RendaVariavel";
import GanhoAcoes from "./pages/GanhoAcoes";
import MelhoresFiis from "./pages/MelhoresFIIS";
import Acoes from "./pages/Acoes";
import Teste from "./pages/AcoesDetalhes";
import AcoesDetalhes from "./pages/AcoesDetalhes";
import Alertas from "./pages/Alertas";

export function Router() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fiiData, setFiiData] = useState<FiiData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://x8ki-letl-twmt.n7.xano.io/api:R98tRgF0:v1/dados_fiis"
        );
        setFiiData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Dashboard />
          ) : (
            <Login handleLogin={handleLogin} isLoggedIn={isLoggedIn} />
          )
        }
      />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/carteira" element={<Carteira />} />
      <Route path="/ganho-acoes" element={<GanhoAcoes />} />
      <Route path="/fiis" element={<RendaVariavel />} />
      <Route path="/fiis/melhoresfiis" element={<MelhoresFiis />} />
      <Route path="/acoes" element={<Acoes />} />
      <Route path="/alertas" element={<Alertas />} />
      <Route path="/acoes/:slug" element={<AcoesDetalhes />} />
      <Route path="/fii/:id" element={<FiiDetalhes fiiData={fiiData} />} />
    </Routes>
  );
}
