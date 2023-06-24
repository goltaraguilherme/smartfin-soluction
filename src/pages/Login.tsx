import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import styles from '../login.module.css';
import axios from 'axios';
import Cookies from "js-cookie";

interface User {
  email: string;
  password: string;
}

interface LoginProps {
  handleLogin: () => void;
  isLoggedIn: boolean;
}

export default function Login({ handleLogin, isLoggedIn }: LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Preencha todos os campos!');
      return;
    }

    axios.post('http://localhost:8081/login', { email, password })
      .then(response => {
        const token = response.data.token;
        if (token) {
          localStorage.setItem('token', token); // Armazena o token no localStorage    
          Cookies.set('token', token);
          handleLogin();
        } else {
          setError('Credenciais inválidas!');
        }
      })
      .catch(error => {
        console.error(error);
        // Lógica de tratamento de erro
      });
  }

  return (
    <>
      <main className="w-[100%] text-white">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 bg-[#13141B] h-[100vh]">
              <div className="container">
                <div className={styles.centralizar}>
                  <div className="flex justify-center">
                    <img className="pt-10" src="../../public/logo.png" alt="" />
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
                      <label htmlFor="email" className="pb-2">Email</label>
                      <br />
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          borderRadius: '10px'
                        }} className="w-[80%] p-2 bg-transparent border border-[#505050]" type="email" id="email" placeholder="Seu email" />

                      <br /><br />

                      <label className="pb-2" htmlFor="name">Senha</label>
                      <br />
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          borderRadius: '10px'
                        }} className="w-[80%] p-2 bg-transparent border border-white" type="password" id="celular" placeholder="Sua senha" />
                      <br /><br />
                      <button type="submit" className="bg-[#2D9BFC] w-[50%] p-2 font-bold" style={
                        {
                          borderRadius: '10px'
                        }
                      }>Entrar</button>

                    </form>

                    <div className="pt-4">

                      <p>Ainda não tem uma conta? <Link className="text-blue-500" to={'/cadastro'}>Registre-se</Link>
                      </p>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
