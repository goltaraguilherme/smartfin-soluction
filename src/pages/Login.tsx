import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import styles from '../login.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserContext } from '../context/UserContext';
import SplashScreen from '../components/SplashScreen';

interface User {
  name: string;
  email: string;
  password: string;
}

interface LoginProps {
  handleLogin: () => void;
  isLoggedIn: boolean;
}

export default function Login({ handleLogin, isLoggedIn }: LoginProps) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Preencha todos os campos!');
      return;
    }

    setIsLoading(true);

    axios
      .post('https://smartfinsoluction-backend.vercel.app/login', { email, password })
      .then(response => {
        const { token } = response.data;

        if (token) {
          const expiresInHours = 1;
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + expiresInHours * 60 * 60 * 1000);

          Cookies.set('token', token, {
            expires: expirationDate,
            secure: true,
            sameSite: 'strict'
          });

          localStorage.setItem('token', token);

          axios
            .get(`https://smartfinsoluction-backend.vercel.app/user/${token}`)
            .then(userResponse => {
              const { name, email } = userResponse.data;
              Cookies.set('name', name);
              Cookies.set('email', email);
              setUser({ name, email });

              if (name && email) {
                setShowSplash(true);
                setTimeout(() => {
                  navigate('/dashboard', { replace: true });
                  handleLogin();
                }, 2000);
              } else {
                setError('Dados de usuário inválidos.');
              }
            })
            .catch(userError => {
              console.error('Erro ao obter informações do usuário:', userError);
              setError('Erro ao obter informações do usuário.');
            });
        } else {
          setError('Falha no login. Verifique suas credenciais.');
        }
      })
      .catch(error => {
        console.error('Erro ao fazer login:', error);
        setError('Usuário ou senha incorretos! Tente novamente');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  return (
    <main className="w-[100%] text-white">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 bg-[#13141B] h-[100vh]">
              <div className="container">
                <div className={styles.centralizar}>
                  <div className="flex justify-center">
                    <img className="pt-10" src="/logo.png" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 bg-[#201F25] h-[100vh]">
              <div className="container">
                <div className={styles.centralizar}>
                  <div className="formulario">
                    <h4 className="font-bold text-left pb-4">Entre ou crie sua conta</h4>
                    {error && (
                      <div className="fixed top-0 right-0 mt-4 mr-4">
                        <div className="bg-red-500 text-white px-4 py-2 rounded shadow" role="alert">
                          {error}
                        </div>
                      </div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <label htmlFor="email" className="pb-2">
                        Email
                      </label>
                      <br />
                      <input
                        onChange={e => setEmail(e.target.value)}
                        style={{
                          borderRadius: '10px'
                        }}
                        className="w-[80%] p-2 bg-transparent border border-[#505050]"
                        type="email"
                        id="email"
                        placeholder="Seu email"
                      />

                      <br />
                      <br />

                      <label className="pb-2" htmlFor="name">
                        Senha
                      </label>
                      <br />
                      <input
                        onChange={e => setPassword(e.target.value)}
                        style={{
                          borderRadius: '10px'
                        }}
                        className="w-[80%] p-2 bg-transparent border border-white"
                        type="password"
                        id="celular"
                        placeholder="Sua senha"
                      />
                      <br />
                      <br />
                      <button
                        type="submit"
                        className="bg-[#2D9BFC] w-[50%] p-2 font-bold"
                        style={{
                          borderRadius: '10px'
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Carregando...' : 'Entrar'}
                      </button>
                    </form>

                    <div className="pt-4">
                      <p>
                        Ainda não tem uma conta?{' '}
                        <Link className="text-blue-500" to={'/cadastro'}>
                          Registre-se
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
