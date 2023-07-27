import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Rpm from './Rpm';
import ReactApexChart from 'react-apexcharts';

// Definindo as interfaces
interface AtivoData {
  id: number;
  nomeAtivo: string;
  quantidadeAtivos: number;
  valorAtivo: string;
  userId: number;
}

interface StockData {
  stock: string;
  name: string;
  close: number;
  change: number;
  volume: number;
  market_cap: number;
  logo: string;
  sector: string;
}

interface RentabilidadeData {
  stock: string;
  valorCompra: number;
  rentabilidadePorcentagem: number;
  rentabilidadeValor: number;
}

interface StocksResponse {
  stocks: StockData[];
}

export const CardVisaoGeral = () => {
  const [rentabilidade, setRentabilidade] = useState<RentabilidadeData[]>([]);
  const [ativos, setAtivos] = useState<AtivoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get('token'); // Obtém o token do Cookies

  useEffect(() => {
    const fetchAtivos = async () => {
      try {
        const response = await axios.get<AtivoData[]>(`https://smartfinsoluction-backend.vercel.app/user/${token}/ativo`);
        setAtivos(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchAtivos();
  }, [token]);

  useEffect(() => {
    const calcularRentabilidade = async () => {
      if (ativos.length === 0) return;

      const rentabilidadeData: RentabilidadeData[] = [];

      try {
        const response = await axios.get<StocksResponse>('https://brapi.dev/api/quote/list');
        const stocks = response.data.stocks;

        for (const ativo of ativos) {
          const stockData = stocks.find((stock) => stock.stock === ativo.nomeAtivo);

          if (stockData) {
            const valorCompra = parseFloat(ativo.valorAtivo);
            const rentabilidadePorcentagem =
              ((stockData.close - valorCompra) / valorCompra) * 100;
            const rentabilidadeValor = stockData.close - valorCompra;

            rentabilidadeData.push({
              stock: ativo.nomeAtivo,
              valorCompra,
              rentabilidadePorcentagem,
              rentabilidadeValor,
            });
          }
        }

        setRentabilidade(rentabilidadeData);
      } catch (error) {
        console.log(error);
      }
    };

    calcularRentabilidade();
  }, [ativos]);

  // Calcular a rentabilidade total da carteira
  const rentabilidadeTotal = rentabilidade.reduce(
    (total, ativo) => total + ativo.rentabilidadePorcentagem,
    0
  );

  // Função para formatar os dados para o gráfico
  const formatChartData = (rentabilidade: RentabilidadeData[]) => {
    return rentabilidade.map((ativo) => ({
      x: ativo.stock,
      y: ativo.rentabilidadePorcentagem,
    }));
  };

  // Configurações do gráfico
  const options = {
    chart: {
      id: 'rentabilidade-dia',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: rentabilidade.map((ativo) => ativo.stock),
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value.toFixed(2)}%`,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(2)}%`,
    },
  };

  const series = [
    {
      name: 'Rentabilidade',
      data: formatChartData(rentabilidade),
    },
  ];

  return (
    <div className='border border-gray rounded h-[90%] p-4 my-4 text-white font-bold'>
      <h3>Rentabilidade</h3>
      <p className='text-[#909090] font-normal'>Diário - {new Date().toLocaleDateString()}</p>
      <span className="text-2xl mt-3">{rentabilidadeTotal.toFixed(2)}%</span>

      {/* Gráfico */}
      <div className="mt-4">
        <ReactApexChart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  );
};
