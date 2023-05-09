import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import styles from '../login.module.css'

export default function Login() {

  

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")

  function handleLogin(e: FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError('Preencha todos os campos!');
      return 
    } 
    navigate('/dashboard')

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

                <form action="" onSubmit={handleLogin}>

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