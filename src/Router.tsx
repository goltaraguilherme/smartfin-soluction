import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import { useAuth } from './context/AuthContext';
import { useRoute } from './context/RouteContext';

import Fii from './components/RendaVariavel/Fii';
import FiiDetalhes from './components/RendaVariavel/FiiDetalhes';
import Cadastro from './pages/Cadastro';
import Carteira from './pages/Carteira';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RendaVariavel, { FiiData } from './pages/RendaVariavel';
import GanhoAcoes from './pages/GanhoAcoes';
import MelhoresFiis from './pages/MelhoresFIIS';
import Acoes from './pages/Acoes';
import AcoesDetalhes from './pages/AcoesDetalhes';
import Alertas from './pages/Alertas';
import { UserProvider } from './context/UserContext';

export function Router() {
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useAuth();
  const { setCurrentRoute } = useRoute();
  const [fiiData, setFiiData] = useState<FiiData[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://x8ki-letl-twmt.n7.xano.io/api:R98tRgF0:v1/dados_fiis'
        );
        setFiiData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      login();
    } else {
      logout();
    }
  }, [login, logout]);

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);

  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <UserProvider>
      <Routes>
        {!isLoggedIn && (
          <>
            <Route path="/" element={<Login handleLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
            <Route path="/cadastro" element={<Cadastro />} />
          </>
        )}

        {isLoggedIn && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/carteira" element={<Carteira />} />
            <Route path="/ganho-acoes" element={<GanhoAcoes />} />
            <Route path="/fiis" element={<RendaVariavel />} />
            <Route path="/fiis/melhoresfiis" element={<MelhoresFiis />} />
            <Route path="/acoes" element={<Acoes />} />
            <Route path="/acoes/:slug" element={<AcoesDetalhes />} />
            <Route path="/fiis/:id" element={<FiiDetalhes fiiData={fiiData} />} />
            <Route path="/alertas" element={<Alertas />} />
          </>
        )}
      </Routes>
    </UserProvider>
  );
}
