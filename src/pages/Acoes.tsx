import axios from 'axios';
import { useEffect, useState } from 'react'
import { CardMenu } from "../components/Dashboard/CardMenu";
import { Header } from "../components/Header";
import Fii from "../components/RendaVariavel/Fii";
import Modal from '../components/Modal';
import { AcoesArea } from '../components/Acoes/acoes';
import { Link } from 'react-router-dom';



export default function Acoes() {


  return (
    <div className="h-[170vh] bg-[#13141B]">
      <Header />

      <div className="m-16 rounded p-16 bg-[#201F25]">

        <div className="flex justify-between align-center py-3">

          <div>
          <h1 className="text-white text-3xl font-bold mb-3">Ações</h1>  

          </div>
       
          <div>
          <Link to={'/alertas'}>
            <button className="bg-red-500 p-[10px] text-white font-semibold rounded">
               Criar alertas
            </button> 
          </Link>
          </div>
  

        </div>





        <div className="row">

          <div className="col-lg-3">
            <CardMenu />
          </div>

          <div className="col-lg-9">
           <AcoesArea />
          </div>



        </div>



      </div>
    </div>



  );
}