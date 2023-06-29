import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
  name: string;
  email: string;
  // Outras propriedades do usuário
}

interface UserContextData {
  user: User | null;
  setUser: (userData: User | null) => void; // Renomeamos a função para setUser
}

export const UserContext = createContext<UserContextData>({} as UserContextData);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se existe um token de autenticação
    const token = Cookies.get('token');
    if (token) {
      // Obter os dados do usuário com base no token
      axios
        .get(`http://localhost:8081/users/${token}`)
        .then((response) => {
          const userData = response.data;
          setUser(userData); // Atualizar os dados do usuário no estado do contexto
        })
        .catch((error) => {
          console.error(error);
          // Lógica de tratamento de erro
        });
    }
  }, []); // Executar apenas uma vez no carregamento inicial da aplicação

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
