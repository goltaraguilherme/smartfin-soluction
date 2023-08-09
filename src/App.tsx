import { BrowserRouter } from 'react-router-dom';

import { Router } from './Router';
import { AuthProvider } from './context/AuthContext';
import { RouteProvider } from './context/RouteContext';
import { UserProvider } from './context/UserContext';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
        <RouteProvider>
          <div className="flex h-[100vh] w-[100vw]">
            <Sidebar />
            <div className="flex flex-col bg-[#ECECEE] flex-1 overflow-hidden">
              <Header />
              <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
                <Router />
              </div>
            </div>
          </div>

        </RouteProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
