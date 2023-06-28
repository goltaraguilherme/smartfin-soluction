import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CardPatrimonio } from '../components/Carteira/CardPatrimõnio';
import { CardRentabilidade } from '../components/Carteira/CardRentabilidade';
import { CardMenu } from '../components/Dashboard/CardMenu';
import { Header } from '../components/Header';

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
  valorAtivo: number;
}

interface StocksResponse {
  stocks: StockData[];
}

export default function Carteira() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeAtivo, setNomeAtivo] = useState('');
  const [quantidadeAtivos, setQuantidadeAtivos] = useState(0);
  const [valorAtivo, setValorAtivo] = useState(0);
  const [sugestoesAtivos, setSugestoesAtivos] = useState<StockData[]>([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [ativos, setAtivos] = useState<AtivoData[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddAtivo = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = Cookies.get('token');
      const response = await axios.post(
        `https://smartfinsoluction-backend.vercel.app/${token}/ativo`,
        {
          nomeAtivo,
          quantidadeAtivos,
          valorAtivo,
        }
      );

      if (response.status === 200) {
        setSuccessAlert(true);
      } else {
        setErrorAlert(true);
      }
    } catch (error) {
      console.log(error);
      setErrorAlert(true);
    }
  };


  useEffect(() => {
    const fetchAtivos = async () => {



      try {
        const token = Cookies.get('token');

        const response = await axios.get(`https://smartfinsoluction-backend.vercel.app/user/${token}/ativo`);
        setAtivos(response.data);
        console.log(response.data)


      } catch (error) {
        console.log(error);
      }
    };
  
    fetchAtivos();
  }, []);

  const fetchSugestoesAtivos = async (nomeAtivo: string) => {
    try {
      const response = await axios.get<StocksResponse>(
        `https://brapi.dev/api/quote/list?search=${nomeAtivo}`
      );
      setSugestoesAtivos(response.data.stocks);
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
    <div className="h-[140vh] bg-[#13141B]">
      <Header />

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
                  <CardPatrimonio />
                </div>
                <div className="col-lg-6">
                <div className="col-lg-12">
              <div className='border border-gray rounded h-[40vh] w-100 mt-0 text-white p-4 overflow-y-auto'>
                <h3 className='text-white text-2xl font-medium'>Meus Ativos</h3>

                <div>

                {ativos.map((ativo, index) => (
                  <div key={index} className="mb-4">
                    {/* Render a card component for each ativo */}
                    <div className="bg-gray-800 p-4 rounded-md">
                  <h4 className="text-white text-lg font-medium">{ativo.nomeAtivo}</h4>
                  <p className="text-gray-300">Quantidade: {ativo.quantidadeAtivos}</p>
                  <p className="text-gray-300">Valor: R$ {ativo.valorAtivo}</p>
                </div>

                  </div>
                ))}
                </div>
              </div>
            </div>
                </div>
                <div className="col-lg-12">
                  <CardRentabilidade />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  onChange={(e) => setValorAtivo(parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
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
