import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import styles from '../login.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserContext } from '../context/UserContext';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Preencha todos os campos!');
      return;
    }

    console.log('Enviando solicitação de login...');
    axios
      .post('https://smartfinsoluction-backend.vercel.app/login', { email, password })
      .then(response => {
        console.log('Resposta da solicitação de login:', response.data);
        const { token } = response.data;

        if (token) {
          console.log('Token recebido:', token);
          const expiresInHours = 1;
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + expiresInHours * 60 * 60 * 1000);
        
          // Armazenar o token no cookie
          Cookies.set('token', token, {
            expires: expirationDate,
            secure: true,
            sameSite: 'strict'
          });
        
          // Armazenar o token no localStorage
          localStorage.setItem('token', token);
        
          console.log('Enviando solicitação para obter informações do usuário...');
          axios
            .get(`https://smartfinsoluction-backend.vercel.app/user/${token}`)
            .then(userResponse => {
              console.log('Resposta da solicitação de informações do usuário:', userResponse.data);
              const { name, email } = userResponse.data;
              Cookies.set('name', name);
              Cookies.set('email', email);
              setUser({ name, email });
        
              // Verificar se os dados do usuário são válidos
              if (name && email) {
                navigate('/dashboard', { replace: true });
                handleLogin();
              } else {
                setError('Dados de usuário inválidos.');
              }
            })
            .catch(userError => {
              console.error('Erro ao obter informações do usuário:', userError);
              // Lógica de tratamento de erro da consulta do usuário
            });
        } else {
          setError('Falha no login. Verifique suas credenciais.');
        }
      })
      .catch(error => {
        console.error('Erro ao fazer login:', error);
        // Lógica de tratamento de erro
      });
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      console.log('Token encontrado nos cookies:', token);
      navigate('/dashboard', { replace: true });
    }
  }, []);

  return (
    <main className="w-[100%] text-white">
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
                    <div className="alert alert-danger" role="alert">
                      {error}
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
                    >
                      Entrar
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
    </main>
  );
}
