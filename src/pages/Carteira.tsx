import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

import { CardMenu } from '../components/Dashboard/CardMenu';
import { Header } from '../components/Header';
import ReactApexChart from 'react-apexcharts';

import { css } from '@emotion/react';
import { ScaleLoader } from 'react-spinners';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useDarkTheme } from '../context/DarkThemeContext';

type AcaoProps = {
  stock: string,
  logo: string,
  name: string,
  change: string,
  volume: string,
  sector: null | string
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

interface AtivoData {
  id: number;
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
  const [editingAtivoId, setEditingAtivoId] = useState<number | null>(null);
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
  const [acoes, setAcoes] = useState<AcaoProps[]>([]);
  const [topAcoes, setTopAcoes] = useState<AcaoProps[]>([]);
  const [acoesFiltradas, setAcoesFiltradas] = useState<AcaoProps[]>([]);
  const [acoesFavoritas, setAcoesFavoritas] = useState<AcaoProps[]>([]);

  const { isDark } = useDarkTheme();
  

  useEffect(() => {
    let acoesFavoritasSalvas = localStorage.getItem("acoesFavoritas")!
    if (acoesFavoritasSalvas) setAcoesFavoritas(JSON.parse(acoesFavoritasSalvas))
    
  }, []);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://x8ki-letl-twmt.n7.xano.io/api:R98tRgF0:v1/dados_fiis"
  //       );
  //       setFiiData(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  useEffect(() => {
    const fetchAcoes = async () => {
      try {
        const response = await axios.get("https://brapi.dev/api/quote/list?limit=10");
        const acoesData = response.data.stocks;
        setAcoes(acoesData);

        let topAcoes = acoesData.sort((a: any, b: any) => {
          if(Number(a.change) > Number(b.change)) return -1
          else return 1
        }).slice(0,5)

        setAcoesFiltradas(acoesData)

        setTopAcoes(topAcoes)

      } catch (error) {
        console.log(error);
      }
    };

    fetchAcoes();
    
    console.log(acoes)
  }, []);

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
    setEditingAtivoId(null);
    setNomeAtivo('');
    setQuantidadeAtivos(0);
    setValorAtivo('');
    setSugestoesAtivos([]);
    setStockPrice(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAtivoId(null);
    setNomeAtivo('');
    setQuantidadeAtivos(0);
    setValorAtivo('');
    setSugestoesAtivos([]);
    setStockPrice(null);
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
        setSuccessAlert(true);
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      console.log(error);
      setErrorAlert(true);
    }
  };

  const handleEditAtivo = (id: number) => {
    const ativo = ativos.find((ativo) => ativo.id === id);

    if (ativo) {
      setEditingAtivoId(ativo.id);
      setNomeAtivo(ativo.nomeAtivo);
      setQuantidadeAtivos(ativo.quantidadeAtivos);
      setValorAtivo(ativo.valorAtivo);
      setIsModalOpen(true);
    }
  };

  const handleUpdateAtivo = async (id: number) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.put(
        `https://smartfinsoluction-backend.vercel.app/user/${token}/ativo/${id}`,
        {
          nomeAtivo,
          quantidadeAtivos,
          valorAtivo,
        }
      );

      if (response.status === 200) {
        // Atualizar a lista de ativos
        const updatedAtivos = ativos.map((ativo) =>
          ativo.id === id ? { ...ativo, nomeAtivo, quantidadeAtivos, valorAtivo } : ativo
        );
        setAtivos(updatedAtivos);
        handleCloseModal();
        setSuccessAlert(true);
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      console.log(error);
      setErrorAlert(true);
    }
  };

  const handleDeleteAtivo = async (id: number) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.delete(
        `https://smartfinsoluction-backend.vercel.app/user/${token}/ativo/${id}`
      );

      if (response.status === 200) {
        // Atualizar a lista de ativos
        const updatedAtivos = ativos.filter((ativo) => ativo.id !== id);
        setAtivos(updatedAtivos);
        setSuccessAlert(true);
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
    <>
      {isLoading ? (
        <div className="flex h-[100%] w-[100%] items-center justify-center dark:bg-[#28292B]">
          <ScaleLoader
            color={`${isDark ? "#EDEEF0" : "#0E0E19"}`}
            loading={isLoading}
            height={60}
            width={8}
            radius={4}
          />
        </div>
      ) : (
        <div className="grid grid-cols-9 grid-rows-11 gap-2 h-[100%] w-[100%]">
          <div className="col-span-4 row-span-6 bg-[#FFFFFF] rounded-lg px-4 py-2 dark:bg-[#141414]">
            <h3 className="font-semibold text-lg dark:text-[#EDEEF0]">Patrimônio</h3>
          </div>

          <div className="col-span-5 row-span-6 bg-[#FFFFFF] rounded-lg px-4 py-2 overflow-auto no-scrollbar dark:bg-[#141414]">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th scope="col" className="font-semibold text-xl w-[25%] dark:text-[#EDEEF0]">Meus Ativos</th>
                  <th scope="col" className="w-[15%] dark:text-[#EDEEF0]"> </th>
                  <th scope="col" className="text-center w-[13%] dark:text-[#EDEEF0]">Qtde</th>
                  <th scope="col" className="text-center w-[12%] dark:text-[#EDEEF0]">P.Médio</th>
                  <th scope="col" className="text-center w-[12%] dark:text-[#EDEEF0]">Preço</th>
                  <th scope="col" className="text-center w-[12%] dark:text-[#EDEEF0]">Retorno</th>
                  <th scope="col" className="text-center w-[11%] dark:text-[#EDEEF0]">% Na<br/> Carteira</th>
                </tr>
              </thead>
            </table>
            <tbody className="flex flex-col gap-2">
              {topAcoes.map((acao) => {
                return (
                  <tr className="flex bg-[#EDEEF0] rounded-lg p-2 dark:bg-[#28292B]">
                    <td className="flex items-center gap-3 w-[25%]">
                      <img
                        className="rounded-full h-12 aspect-square"
                        src={acao.logo}
                        alt="Logo"
                      />
                      <div>
                        <h4 className="font-bold text-base text-[#0E0E19] dark:text-[#EDEEF0]">
                          {acao.name}
                        </h4>
                        <h5 className="text-sm text-[#96969C] dark:text-[#EDEEF0]">{acao.stock}</h5>
                      </div>
                    </td>
                    <td className="flex items-center w-[18%]">
                      <div className="flex items-center gap-2">
                        <div
                          className={`py-1 px-3 rounded-lg ${
                            Number(acao.change) >= 0
                              ? "bg-[#5DDF52]"
                              : "bg-[#FF2727]"
                          }`}
                        >
                          <img
                            className={`${
                              Number(acao.change) < 0 && "rotate-90"
                            }`}
                            src="/assets/seta-subida.png"
                            alt="Seta de crescimento"
                          />
                        </div>
                        <p
                          className={`font-semibold ${
                            Number(acao.change) >= 0
                              ? "text-[#5DDF52]"
                              : "text-[#FF2727]"
                          }`}
                        >
                          {Number(acao.change) > 0 && "+"}
                          {Number(acao.change).toFixed(2)}%
                        </p>
                      </div>
                    </td>
                    <td className="text-center my-auto w-[13%] dark:text-[#EDEEF0]">99999</td>
                    <td className="text-center my-auto w-[12%] dark:text-[#EDEEF0]">30,28</td>
                    <td className="text-center my-auto w-[12%] dark:text-[#EDEEF0]">31,29</td>
                    <td className="text-center my-auto w-[12%] text-[#5DDF52]">12,20%</td>
                    <td className="text-center my-auto w-[11%] dark:text-[#EDEEF0]">5,8%</td>
                  </tr>
                );
              })}
            </tbody>
          </div>

          <div className="col-span-6 row-span-5 bg-[#FFFFFF] rounded-lg px-4 py-2 dark:bg-[#141414]">
            <h3 className="font-semibold text-lg dark:text-[#EDEEF0]">Performance de Carteira</h3>
          </div>

          <div className="flex flex-col col-span-3 gap-2 row-span-5 rounded-lg">
            <div className="bg-[#FFFFFF] flex-1  rounded-lg px-4 py-2 dark:bg-[#141414]">
              <div className="flex bg-[#EDEEF0] gap-3 rounded-lg dark:bg-[#28292B]">
                <div className="flex bg-[#1C1D1F] rounded-lg p-2 aspect-square items-center justify-center">
                  <img
                    className="h-[80%]"
                    src="/assets/import-wallet.png"
                    alt="Ícone importar B3"
                  />
                </div>
                <div className="flex flex-col flex-1 p-2 justify-center">
                  <h3 className='dark:text-[#EDEEF0]'>Importação</h3>
                  <h2 className="font-bold text-xl dark:text-[#EDEEF0]">Investidor.B3</h2>
                </div>
                <button className="flex bg-[#1C1D1F] rounded-lg p-2 w-[13%] aspect-square items-center justify-center">
                  <img src="/assets/seta-direita.png" alt="Seta para direita" />
                </button>
              </div>
            </div>
            <div className="bg-[#FFFFFF] flex-1 rounded-lg px-4 py-2 dark:bg-[#141414]">
              <div className="flex bg-[#EDEEF0] gap-3 rounded-lg dark:bg-[#28292B]">
                <div className="flex bg-[#1C1D1F] rounded-lg p-2 aspect-square items-center justify-center">
                  <img
                    className="h-[80%]"
                    src="/assets/goal-wallet.png"
                    alt="Ícone carteira ideal"
                  />
                </div>
                <div className="flex flex-col flex-1 p-2 justify-center">
                  <h3 className="dark:text-[#EDEEF0]">Carteira</h3>
                  <h2 className="font-bold text-xl dark:text-[#EDEEF0]">Ideal</h2>
                </div>
                <button className="flex bg-[#1C1D1F] rounded-lg p-2 w-[13%] aspect-square items-center justify-center">
                  <img src="/assets/seta-direita.png" alt="Seta para direita" />
                </button>
              </div>
            </div>
            <div className="bg-[#FFFFFF] flex-1  rounded-lg px-4 py-2 dark:bg-[#141414]">
              <div className="flex bg-[#EDEEF0] gap-3 rounded-lg dark:bg-[#28292B]">
                <div className="flex bg-[#1C1D1F] rounded-lg p-2 aspect-square items-center justify-center">
                  <img
                    className="h-[80%]"
                    src="/assets/spoke-with.png"
                    alt="Ícone falar com assessor"
                  />
                </div>
                <div className="flex flex-col flex-1 p-2 justify-center">
                  <h3 className="dark:text-[#EDEEF0]">Falar com</h3>
                  <h2 className="font-bold text-xl dark:text-[#EDEEF0]">Assessor</h2>
                </div>
                <button className="flex bg-[#1C1D1F] rounded-lg p-2 w-[13%] aspect-square items-center justify-center">
                  <img src="/assets/seta-direita.png" alt="Seta para direita" />
                </button>
              </div>
            </div>
            <div className="bg-[#FFFFFF] flex-1 rounded-lg px-4 py-2 dark:bg-[#141414]">
              <div className="flex bg-[#EDEEF0] gap-3 rounded-lg dark:bg-[#28292B]">
                <div className="flex bg-[#1C1D1F] rounded-lg p-2 aspect-square items-center justify-center">
                  <img
                    className="h-[80%]"
                    src="/assets/spoke-with.png"
                    alt="Ícone falar com assessorideal"
                  />
                </div>
                <div className="flex flex-col flex-1 p-2 justify-center">
                  <h3 className="dark:text-[#EDEEF0]">Falar com seu</h3>
                  <h2 className="font-bold text-xl dark:text-[#EDEEF0]">Assessor</h2>
                </div>
                <button className="flex bg-[#1C1D1F] rounded-lg p-2 w-[13%] aspect-square items-center justify-center">
                  <img src="/assets/seta-direita.png" alt="Seta para direita" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {successAlert && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-[#FFFFFF] px-4 py-2 rounded-md">
          Ativo atualizado com sucesso!
        </div>
      )}

      {errorAlert && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-[#FFFFFF] px-4 py-2 rounded-md">
          Ocorreu um erro ao atualizar o ativo. Por favor, tente novamente.
        </div>
      )}
    </>
  );
}
