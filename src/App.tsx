import { BrowserRouter } from 'react-router-dom';

import { Router } from './Router';
import { AuthProvider } from './context/AuthContext';
import { RouteProvider } from './context/RouteContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
        <RouteProvider>
          <Router />
        </RouteProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
