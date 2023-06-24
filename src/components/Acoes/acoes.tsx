import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export interface AcaoData {
  stock: string;
  name: string;
  close: number;
  change: number;
  volume: number;
  market_cap: number;
  logo: string;
  sector: string;
}

export const AcoesArea = () => {
  const [acoes, setAcoes] = useState<AcaoData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ stocks: AcaoData[] }>('https://brapi.dev/api/quote/list');
        const data = response.data.stocks; // Acessar o objeto "stocks"
       
        setAcoes(data);
      } catch (error) {
        console.log(error);
        // Trate o erro de solicitação aqui, se necessário
      }
    };
  
    fetchData().then(() => {
 // Verificar o valor atual de acoes
    });
  }, []);

  const getAnaliseAcaoUrl = (slug: string) => {
    return `/acoes/${slug.toLowerCase()}`;
  };



  return (
    <div className='border border-solid border-[#fff] rounded p-4'>
      <div className="row">
      {acoes.length > 0 ? (
        acoes.map((acao) => (
          <div key={acao.stock} className="col-lg-4">
            <div className='text-white bg-[#23242F] p-10 my-2 rounded'>

                <div className="flex justify-between align-center">

                  <div>
                      <p className='font-bold'>{acao.stock}</p>
                      <h1 className='text-left'>{acao.name}</h1>
             
                  </div>

                  <div>
                      <img className='w-[80%] max-w-sm rounded' src={acao.logo} alt="Logo" />
                  </div>

                </div>
         

              <div className='flex justify-between align-center w-[100%] pt-4'>

                  <div>
                      <p>R${acao.close}</p>
                  </div>

                  <div>
                      <p style={{ color: acao.change < 0 ? 'red' : '#01E59B', fontWeight: '700' }}>{acao.change}%</p>
                  </div>
              </div>

              <div>

                <Link to={getAnaliseAcaoUrl(acao.stock)} rel="noopener noreferrer"><button>Saiba mais</button></Link>

              </div>

            </div>
          </div>
        ))
      ) : (
        <div className='text-white'>Carregando...</div>
      )}
      </div>
    </div>
  );
};
