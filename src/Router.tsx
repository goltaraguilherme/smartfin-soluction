import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Fii from "./components/RendaVariavel/Fii";
import FiiDetalhes from "./components/RendaVariavel/FiiDetalhes";
import Cadastro from "./pages/Cadastro";
import Carteira from "./pages/Carteira";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RendaVariavel, { FiiData } from "./pages/RendaVariavel";

export function Router() {

    
  const [fiiData, setFiiData] = useState<FiiData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://x8ki-letl-twmt.n7.xano.io/api:R98tRgF0:v1/dados_fiis"
        );
        console.log(response.data)
        setFiiData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);




  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro /> } />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/carteira" element={<Carteira />}/>
        <Route path="/renda-variavel" element={<RendaVariavel />} />
        <Route path="/fii/:id" element={<FiiDetalhes fiiData={fiiData}/>} />
    </Routes>
  );
}