import React from 'react';
import { Header } from '../components/Header';
import { CardMenu } from '../components/Dashboard/CardMenu';



export default function MelhoresFiis() {
  return (
    <div className="h-[140vh] bg-[#13141B]">

      <Header />


        <div className="m-16 rounded p-16 bg-[#201F25]">
          <div className="container-fluid">


                  <div className="row">

        <div className="col-lg-3">
          <CardMenu />
        </div>

        <div className="col-lg-9">

        <div className='border border-solid border-[#fff] p-4 rounded'>
        <div>
              <h1 className='text-white text-3xl'>Oba! Esses são os melhores FIIS para você</h1>
          </div>

          <div>


            <div className="row py-10">

              <div className="col-lg-4">
                    <div className="rounded mx-1 p-3 w-[100%] bg-[#23242F]">
                    <div className="flex items-start justify-between">
                    <div className="">
                      <h2 className="text-white font-bold">OURIJ11</h2>
                      <p className="text-[#01E59B] font-medium text-2xl">9%</p>
                    </div>
                    <div className="">
                      <p className="text-[#01E59B] font-medium">R$10,00</p>
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="text-[#A4A4A4] uppercase">Desconhecido</p>
                  </div>
          </div>
              </div>


              <div className="col-lg-4">
                    <div className="rounded mx-1 p-3 w-[100%] bg-[#23242F]">
                    <div className="flex items-start justify-between">
                    <div className="">
                      <h2 className="text-white font-bold">OURIJ11</h2>
                      <p className="text-[#01E59B] font-medium text-2xl">9%</p>
                    </div>
                    <div className="">
                      <p className="text-[#01E59B] font-medium">R$10,00</p>
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="text-[#A4A4A4] uppercase">Desconhecido</p>
                  </div>
          </div>
              </div>



              <div className="col-lg-4">
                    <div className="rounded mx-1 p-3 w-[100%] bg-[#23242F]">
                    <div className="flex items-start justify-between">
                    <div className="">
                      <h2 className="text-white font-bold">OURIJ11</h2>
                      <p className="text-[#01E59B] font-medium text-2xl">9%</p>
                    </div>
                    <div className="">
                      <p className="text-[#01E59B] font-medium">R$10,00</p>
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="text-[#A4A4A4] uppercase">Desconhecido</p>
                  </div>
          </div>
              </div>

            </div>

            <div className='flex py-10 justify-between'>

            </div>

          <div>
            <p className='text-white'>*Essas informações são geradas através de parâmetros que você mesmo criou.</p>
          </div>


          </div>
        </div>

 

          </div>
        </div>
        </div>

      </div>



    </div>
  );
}