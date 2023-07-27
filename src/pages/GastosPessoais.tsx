import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { CardMenu } from '../components/Dashboard/CardMenu';
import { FaSpinner } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';
import { MdWarning } from 'react-icons/md';

interface Gasto {
  categoria: string;
  valor: number;
}

const GastosPessoais = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [categoria, setCategoria] = useState<string>('');
  const [valor, setValor] = useState<string>('');
  const [renda, setRenda] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [excedeRenda, setExcedeRenda] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<'adicionarGasto' | 'adicionarRenda'>('adicionarGasto');
  const [rendaMensalInput, setRendaMensalInput] = useState<number>(0);

  const meses = [
    { id: 1, nome: 'Janeiro' },
    { id: 2, nome: 'Fevereiro' },
    { id: 3, nome: 'Março' },
    // Adicione outros meses aqui
  ];

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUserGastos(token);
    }
  }, []);

  useEffect(() => {
    const categoriasData = calcularCategoriaData();
    const totalDespesas = calcularTotalDespesas();

    // Calcula o total de despesas, excluindo a "Renda"
    setExcedeRenda(totalDespesas > renda);
    const novoLucro = renda - totalDespesas;
    setLucro(novoLucro);

    // O carregamento dos dados foi concluído, definimos loading como false
    setLoading(false);
  }, [gastos, renda]);

  const fetchUserGastos = async (token: string) => {
    try {
      const response = await axios.get(
        `https://smartfinsoluction-backend.vercel.app/user/${token}/gastos`
      );
      setGastos(response.data);
      // O carregamento dos dados foi concluído, definimos dataLoaded como true
      setDataLoaded(true);
    } catch (error) {
      console.error('Erro ao buscar gastos do usuário:', error);
      // Em caso de erro, também definimos dataLoaded como true
      setDataLoaded(true);
    }
  };

  const handleAdicionarGasto = (e: React.FormEvent) => {
    e.preventDefault();

    if (categoria && valor) {
      if (categoria === 'Renda') {
        setRenda(Number(valor));
        // Enviar a categoria "Renda" para a API
        addGasto(Cookies.get('token') || '', categoria, Number(valor));
      } else {
        const token = Cookies.get('token');
        if (token) {
          addGasto(token, categoria, Number(valor));
        }
      }
      setCategoria('');
      setValor('');
    }
  };

  const handleAdicionarRenda = (e: React.FormEvent) => {
    e.preventDefault();
    setRenda(rendaMensalInput);
    setIsModalOpen(false);
  };

  const addGasto = async (token: string, categoria: string, valor: number) => {
    try {
      const response = await axios.post(
        `https://smartfinsoluction-backend.vercel.app/user/${token}/gastos`,
        { categoria, valor }
      );
      console.log(response.data);
      // Atualiza os gastos após adição bem sucedida
      fetchUserGastos(token);
    } catch (error) {
      console.error('Erro ao adicionar gasto:', error);
    }
  };

  const calcularTotalDespesas = () => {
    return gastos.reduce((total, gasto) => total + gasto.valor, 0);
  };

  const calcularCategoriaData = () => {
    const categorias: { [key: string]: number } = {
      Moradia: 0,
      Saúde: 0,
      Transporte: 0,
      'Despesas Pessoais': 0,
      Dependentes: 0,
      Lazer: 0,
    };

    gastos.forEach((gasto) => {
      if (categorias.hasOwnProperty(gasto.categoria)) {
        // A categoria 'Renda' não é uma despesa, então não somamos seu valor aqui
        if (gasto.categoria !== 'Renda') {
          categorias[gasto.categoria] += gasto.valor;
        }
      }
    });

    return Object.entries(categorias).map(([categoria, valor]) => ({
      categoria,
      valor,
    }));
  };

  const totalDespesas = calcularTotalDespesas();

  // Adicionar estado para o lucro
  const [lucro, setLucro] = useState<number>(0);

  // Adicionar estado para a cor do texto do Lucro
  const [corLucro, setCorLucro] = useState<string>(''); // 'text-green' para positivo, 'text-red' para negativo

  useEffect(() => {
    // Atualiza a cor do texto do Lucro com base no seu valor
    if (lucro > 0) {
      setCorLucro('text-green');
    } else {
      setCorLucro('text-red');
    }
  }, [lucro]);

  return (
    <div className="h-[120vh] bg-[#13141B]">
      <Header />
      <div className="m-16 rounded p-16 bg-[#201F25]">
        <div className="container mx-auto">
          {dataLoaded ? (
            // Conteúdo da tabela, já que os dados foram carregados
            <div className="flex flex-wrap mx-0">
              <div className="w-full lg:w-[30%] px-4">
                <CardMenu />
              </div>
              <div className="w-full lg:w-[70%] px-4">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-white text-3xl font-bold">Gestão pessoal</h1>
                  <div className="flex flex-row justify-between">
                    <div>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                          setIsModalOpen(true);
                          setModalContent('adicionarGasto');
                        }}
                      >
                        Adicionar gasto
                      </button>
                    </div>
                    <button
                      className="bg-blue-600 ml-5 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setIsModalOpen(true);
                        setModalContent('adicionarRenda');
                      }}
                    >
                      Adicionar renda
                    </button>
                  </div>
                </div>
                <div className="my-4 rounded-lg shadow">
                  <table className="table-auto w-full">
                    <thead>
                      <tr className="bg-blue-500 text-white">
                        <th className="px-4 py-2">Categoria</th>
                        <th className="px-4 py-2">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calcularCategoriaData().map((categoria) => (
                        <tr key={categoria.categoria}>
                          <td className="border text-white px-4 py-2">{categoria.categoria}</td>
                          <td className="border px-4 text-white py-2">R${categoria.valor.toFixed(2)}</td>
                        </tr>
                      ))}

                      {/* Nova linha para exibir a "Renda Mensal" */}
                      <tr>
                        <td className="border text-green-500 px-4 py-2">Renda Mensal</td>
                        <td className="border px-4 text-green-500 py-2">R${renda.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='flex flex-row justify-between'>
                    <div className='w-100 bg-blue-600 p-4 my-4 border border-[#fff]'>
                      <h3 className='text-white'>RENDA MENSAL</h3>
                      <span className='text-white text-[30px] font-semibold'>R${renda.toFixed(2)}</span>
                    </div>

                    <div className='w-100 bg-red-600 p-4 my-4 border border-[#fff]'>
                      <h3 className='text-white'>DESPESAS TOTAIS</h3>
                      <span className='text-white text-[30px] font-semibold'>R${totalDespesas.toFixed(2)}</span>
                    </div>

                    <div className='w-100 bg-green-600 p-4 my-4 border border-[#fff]'>
                      <h3 className='text-white'>LUCRO</h3>
                      <span className={`text-white text-[30px] font-semibold ${corLucro}`}>R${lucro.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Spinner de loading enquanto os dados são carregados
            <div className="flex justify-center items-center h-40">
              <FaSpinner className="animate-spin h-6 w-6 mr-2 text-blue-500" />
              <span className="text-blue-500 font-semibold">Carregando Dados...</span>
            </div>
          )}
        </div>
      </div>
      {excedeRenda && (
        <div className="mb-4">
          <div
            className="fixed top-0 right-0 p-4 m-4 bg-red-500 text-white flex items-center gap-4 rounded-md animate-fade-in-right"
            style={{ animationDuration: '0.5s' }}
          >
            <MdWarning className="text-white h-6 w-6" />
            <span>Você está gastando mais do que sua renda. Tome cuidado!</span>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8">
            {modalContent === 'adicionarGasto' && (
              <>
                <h2 className="text-xl font-bold mb-4">Adicionar Despesa</h2>
                <form onSubmit={handleAdicionarGasto} className="mt-4">
                <label className="block mb-4">
                    Categoria:
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="border border-gray-300 px-4 py-2 mt-1 block w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="Renda">Renda</option>
                      <option value="Moradia">Moradia</option>
                      <option value="Saúde">Saúde</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Despesas Pessoais">Despesas Pessoais</option>
                      <option value="Dependentes">Dependentes</option>
                      <option value="Lazer">Lazer</option>
                    </select>
                  </label>
                  <label className="block mb-4">
                    Valor:
                    <input
                      type="number"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      className="border border-gray-300 px-4 py-2 mt-1 block w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Adicionar gasto
                  </button>
                  <button
                    className="bg-gray-300 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button> {/* ...código anterior... */}
                </form>
              </>
            )}
            {modalContent === 'adicionarRenda' && (
              <>
                <h2 className="text-xl font-bold mb-4">Adicionar Renda</h2>
                <form onSubmit={handleAdicionarRenda} className="mt-4">
                <label className="block mb-4">
                    Renda Mensal:
                    <input
                      type="number"
                      value={rendaMensalInput}
                      onChange={(e) => setRendaMensalInput(Number(e.target.value))}
                      className="border border-gray-300 px-4 py-2 mt-1 block w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                  
                  <div className="flex flex-row justify-between">
                  
                  <div>
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Adicionar Renda
                      </button>
                  </div>

                  <div>
                      <button
                      className="bg-gray-300 text-white px-4 py-2 rounded"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>             
                </div>

                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GastosPessoais;
