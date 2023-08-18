import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { Router } from './Router';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router';
import { RouteProvider } from './context/RouteContext';
import { UserProvider } from './context/UserContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useDarkTheme } from "./context/DarkThemeContext";

function App() {
  const { isLoggedIn, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkTheme();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      logout();
      navigate('/login');
    }
  }, [logout, navigate]);

  return (
    <UserProvider>
      <RouteProvider>
          <div className={`flex h-[100vh] w-[100vw] ${isDark && 'dark'}`}>
            {isLoggedIn ? (
              <>
                <Sidebar />
                <div className="flex flex-col bg-[#ECECEE] flex-1 overflow-hidden dark:bg-[#28292B]">
                  <Header />
                  <div className="flex-1 p-6 overflow-y-auto no-scrollbar dark:bg-[#28292B]">
                    <Router />
                  </div>
                </div>
              </>
            ) : (
              <Router />
            )}
          </div>
      </RouteProvider>
    </UserProvider>
  );
}

export default App;
