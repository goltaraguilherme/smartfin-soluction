import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ReactApexChart from 'react-apexcharts';
import { ScaleLoader } from 'react-spinners';

interface AtivoData {
  nomeAtivo: string;
  quantidadeAtivos: number;
  valorAtivo: string;
}

export const CardGanhos = () => {
  const [patrimonioTotal, setPatrimonioTotal] = useState<number>(0);
  const [ativosData, setAtivosData] = useState<AtivoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const token = Cookies.get('token'); // Obtém o token do Cookies

  useEffect(() => {
    const fetchAtivos = async () => {
      try {
        const response = await axios.get<AtivoData[]>(`https://smartfinsoluction-backend.vercel.app/user/${token}/ativo`);
        const ativos = response.data;

        // Calcula o valor total de cada ativo e soma para obter o patrimônio total
        const patrimonioTotalUsuario = ativos.reduce((total, ativo) => {
          const quantidadeAtivos = ativo.quantidadeAtivos;
          const valorAtivo = parseFloat(ativo.valorAtivo.replace(',', '.'));
          return total + quantidadeAtivos * valorAtivo;
        }, 0);

        setPatrimonioTotal(patrimonioTotalUsuario);
        setAtivosData(ativos);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchAtivos();
  }, [token]);

  const patrimonioTotalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(patrimonioTotal);

  const options = {
    labels: ativosData.map((ativo) => ativo.nomeAtivo),
  };

  const series = ativosData.map((ativo) => ativo.quantidadeAtivos);

  return (
    <div className='border border-gray rounded h-[60vh] my-4 text-white p-4'>
      <h3 className='text-white font-bold '>Patrimônio Total</h3>
      <h3 className={`text-3xl font-bold ${patrimonioTotal >= 0 ? 'text-white' : 'text-red-500'}`}>
        {patrimonioTotalFormatted}
      </h3>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="absolute top-0 left-0  bg-black opacity-50"></div>
          <ScaleLoader color="#ffffff" loading={isLoading} height={60} width={8} radius={4} />
        </div>
      ) : (
        <div className="mt-4">
          <ReactApexChart options={options} series={series} type="pie" height={300} />
        </div>
      )}
    </div>
  );
};
