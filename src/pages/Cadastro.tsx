import { Header } from "../components/Header";
import styles from '../../login.module.css'

export default function Cadastro() {
  return (
    <>
    <main className="w-[100%] text-white">
      <div className="container-fluid">
      <div className="row">

      <div className="col-lg-6 bg-[#13141B] h-[100vh]">
        <div className="container">
          <div>
            dakosdkasodkaoskd
          </div>
        </div>
      </div>

      <div className="col-lg-6 bg-[#201F25] h-[100vh]">
        <div className="container">
          <div className={styles.centralizar}>
              <div className="formulario">

                <h4 className="font-bold text-left pb-4">Entre ou crie sua conta</h4>

                <form action="">

                  <label htmlFor="name">Nome Completo</label>
                  <br />
                  <input type="text" id="name" placeholder="Seu nome" />

                  <br /><br />

                  <label htmlFor="name">Email</label>
                  <br />
                  <input type="text" id="name" placeholder="Seu nome" />

                  <br /><br />

                  <label htmlFor="name">Celular</label>
                  <br />
                  <input type="text" id="celular" placeholder="(11) 99999-9999" />


                  <br /><br />

                  <label htmlFor="name">Senha</label>
                  <br />
                  <input type="text" id="celular" placeholder="(11) 99999-9999" />

                  <br /><br />

                  <button>Criar conta</button>
               

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