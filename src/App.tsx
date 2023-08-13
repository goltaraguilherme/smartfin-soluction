import { Router } from './Router';
import { useAuth } from './context/AuthContext';
import { RouteProvider } from './context/RouteContext';
import { UserProvider } from './context/UserContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

function App() {
  const { isLoggedIn } = useAuth();
  
  return (
    <UserProvider>
      <RouteProvider>
        <div className="flex h-[100vh] w-[100vw]">
          {isLoggedIn ? (
            <>
              <Sidebar />
              <div className="flex flex-col bg-[#ECECEE] flex-1 overflow-hidden">
                <Header />
                <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
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
