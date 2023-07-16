import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

import { CardMenu } from '../components/Dashboard/CardMenu';
import { Header } from '../components/Header';
import ReactApexChart from 'react-apexcharts';

import { css } from '@emotion/react';
import { ScaleLoader } from 'react-spinners';


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

interface AtivoData {
  nomeAtivo: string;
  quantidadeAtivos: number;
  valorAtivo: string;
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

export default function Carteira() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeAtivo, setNomeAtivo] = useState('');
  const [quantidadeAtivos, setQuantidadeAtivos] = useState(0);
  const [valorAtivo, setValorAtivo] = useState('');
  const [sugestoesAtivos, setSugestoesAtivos] = useState<StockData[]>([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [ativos, setAtivos] = useState<AtivoData[]>([]);
  const [stockPrice, setStockPrice] = useState<number | null>(null);
  const [patrimonioTotal, setPatrimonioTotal] = useState(0);
  const [rentabilidade, setRentabilidade] = useState<RentabilidadeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calcularRentabilidade = async () => {
      const rentabilidadeData: RentabilidadeData[] = [];

      for (const ativo of ativos) {
        const response = await axios.get<StocksResponse>(
          `https://brapi.dev/api/quote/list?search=${ativo.nomeAtivo}`
        );

        const stockData = response.data.stocks.find(
          (stock) => stock.stock === ativo.nomeAtivo
        );

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
    };

    calcularRentabilidade();
  }, [ativos]);

  useEffect(() => {
    const fetchAtivos = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(
          `https://smartfinsoluction-backend.vercel.app/user/${token}/ativo`
        );
        setAtivos(response.data);
        setIsModalOpen(false); // Fechar o popup
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAtivos();
  }, []);

  useEffect(() => {
    const calcularPatrimonioTotal = () => {
      let total = 0;
      ativos.forEach((ativo) => {
        const valorCompra = parseFloat(ativo.valorAtivo);
        const quantidade = ativo.quantidadeAtivos;
        total += valorCompra * quantidade;
      });
      setPatrimonioTotal(total);
    };

    calcularPatrimonioTotal();
  }, [ativos]);

  const options = {
    labels: ativos.map((ativo) => ativo.nomeAtivo),
  };

  const series = ativos.map((ativo) => {
    const valorCompra = parseFloat(ativo.valorAtivo);
    const quantidade = ativo.quantidadeAtivos;
    return valorCompra * quantidade;
  });

  const patrimonioTotalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(patrimonioTotal);

  // Calcular a rentabilidade total da carteira
  const rentabilidadeTotal = rentabilidade.reduce(
    (total, ativo) => total + ativo.rentabilidadePorcentagem,
    0
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchAtivos = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        `https://smartfinsoluction-backend.vercel.app/user/${token}/ativo`
      );
      setAtivos(response.data);
      setIsModalOpen(false); // Fechar o popup
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddAtivo = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = Cookies.get('token');
      const response = await axios.post(
        `https://smartfinsoluction-backend.vercel.app/user/${token}/ativo`,
        {
          nomeAtivo,
          quantidadeAtivos,
          valorAtivo,
        }
      );

      if (response.status === 200) {
        handleCloseModal(); // Fechar o popup

        // Buscar os ativos atualizados
        fetchAtivos();
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      console.log(error);
      setErrorAlert(true);
    }
  };

  const fetchSugestoesAtivos = async (nomeAtivo: string) => {
    try {
      const response = await axios.get<StocksResponse>(
        `https://brapi.dev/api/quote/list?search=${nomeAtivo}`
      );
      setSugestoesAtivos(response.data.stocks);
      if (response.data.stocks.length > 0) {
        setStockPrice(response.data.stocks[0].close);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (nomeAtivo) {
      fetchSugestoesAtivos(nomeAtivo);
    }
  }, [nomeAtivo]);

  useEffect(() => {
    let successTimer: NodeJS.Timeout | undefined;
    let errorTimer: NodeJS.Timeout | undefined;

    if (successAlert) {
      successTimer = setTimeout(() => {
        setSuccessAlert(false);
      }, 3000);
    }

    if (errorAlert) {
      errorTimer = setTimeout(() => {
        setErrorAlert(false);
      }, 3000);
    }

    return () => {
      clearTimeout(successTimer);
      clearTimeout(errorTimer);
    };
  }, [successAlert, errorAlert]);

  return (
    <div className="h-[200vh] bg-[#13141B]">
      <Header />

      {isLoading ? (
        <div className="h-screen flex items-center justify-center">
        <ScaleLoader color="#fff" loading={isLoading} height={60} width={8} radius={4} />
        </div>
      ) : (
        <div className="m-16 rounded p-16 bg-[#201F25]">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-6">
                <h1 className="text-white mb-3 text-3xl font-bold">Carteira</h1>
              </div>
              <div className="col-lg-6">
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={handleOpenModal}
                  >
                    Adicionar ativo
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <CardMenu />
              </div>
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-lg-6">
                    <div>
                      <div className="border border-gray-300 rounded h-[70vh] mt-0 p-4 relative">
                        <h2 className="text-white mb-3 text-2xl">Patrimônio</h2>
                        <ReactApexChart
                          options={options}
                          series={series}
                          type="pie"
                          height={350}
                        />

                        <p className="text-white text-xl mt-4">
                          Patrimônio Total: {patrimonioTotalFormatted}
                        </p>
                        <p className="text-white text-xl mt-4">
                          Rentabilidade Total: {rentabilidadeTotal.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="border border-gray-300 rounded h-[70vh] mt-0 p-4 relative">
                      <h3 className="text-white text-2xl font-medium py-2 px-4 mb-4 sticky top-0 z-10">
                        Meus Ativos
                      </h3>
                      <div className="h-[calc(100%-5rem)] overflow-y-auto custom-scroll">
                        {ativos.map((ativo, index) => (
                          <div
                            key={index}
                            className="bg-gray-800 p-6 m-4 rounded-md mb-4"
                          >
                            <h4 className="text-white text-lg font-medium text-[20px]">
                              {ativo.nomeAtivo}
                            </h4>
                            <p className="text-gray-200 text-[18px]">
                              {ativo.quantidadeAtivos} ativos
                            </p>
                            <p className="text-green-400 font-semibold">
                              Comprou por R${ativo.valorAtivo}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="border border-gray-300 rounded h-[60vh] mt-5 p-4 relative h-[calc(100%-5rem)] overflow-y-auto custom-scroll">
                      <h3 className="text-[20px] text-white">Rentabilidade</h3>
                      {rentabilidade.map((ativo) => (
                        <div
                          key={ativo.stock}
                          className="bg-gray-800 p-6 m-4 rounded-md mb-4 "
                        >
                          <p className="text-white text-[20px] font-bold">{ativo.stock}</p>
                          <p className='text-white text-[18px]'>Valor de Compra: R${ativo.valorCompra}</p>
                          <p className='text-green-400'>
                            Rentabilidade (%): {ativo.rentabilidadePorcentagem.toFixed(2)}
                          </p>
                          <p className='text-green-400'>
                            Rentabilidade (Valor): R${ativo.rentabilidadeValor.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4">Adicionar Ativo</h2>
            <form onSubmit={handleAddAtivo}>
              <div className="mb-4">
                <label htmlFor="nome-ativo" className="block text-gray-700">
                  Nome do Ativo
                </label>
                <input
                  id="nome-ativo"
                  type="text"
                  className="border border-gray-300 px-4 py-2 mt-1 block w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={nomeAtivo}
                  onChange={(e) => setNomeAtivo(e.target.value)}
                  required
                />
              </div>
              {sugestoesAtivos.length > 0 && (
                <div className="mb-4">
                  <ul className="mt-2">
                    {sugestoesAtivos.slice(0, 10).map((ativo) => (
                      <li
                        key={ativo.stock}
                        className="cursor-pointer text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md"
                        onClick={() => {
                          setNomeAtivo(ativo.stock);
                          setSugestoesAtivos([]);
                        }}
                      >
                        {ativo.stock} - {ativo.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mb-4">
                {stockPrice !== null && (
                  <p className="text-gray-400 mt-2">
                    Preço da Ação: {stockPrice}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="quantidade-ativos" className="block text-gray-700">
                  Quantidade de Ativos
                </label>
                <input
                  id="quantidade-ativos"
                  type="number"
                  className="border border-gray-300 px-4 py-2 mt-1 block w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={quantidadeAtivos}
                  onChange={(e) => setQuantidadeAtivos(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="valor-compra-ativo" className="block text-gray-700">
                  Valor de Compra do Ativo
                </label>
                <input
                  id="valor-compra-ativo"
                  type="text"
                  className="border border-gray-300 px-4 py-2 mt-1 block w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={valorAtivo}
                  onChange={(e) => setValorAtivo(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  type="submit"
                >
                  Adicionar
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successAlert && (
        <div className="fixed top-0 right-0 m-4">
          <div className="bg-green-500 text-white py-2 px-4 rounded-md">
            Dados enviados com sucesso!
          </div>
        </div>
      )}

      {errorAlert && (
        <div className="fixed top-0 right-0 m-4">
          <div className="bg-red-500 text-white py-2 px-4 rounded-md">
            Erro ao enviar os dados. Tente novamente.
          </div>
        </div>
      )}
    </div>
  );
}
