import { useEffect, useState } from "react";
import FiiCards from "../components/Dashboard/FIICard";
import { Header } from "../components/Header";
import axios from 'axios';
import { CardMenu } from "../components/Dashboard/CardMenu";
import { CardGanhos } from "../components/Dashboard/CardGanhos";
import { CardVisaoGeral } from "../components/Dashboard/CardVisaoGeral";
import { CardNoticias } from "../components/Dashboard/CardNoticias";

export type FiiData = {
  id: number;
  C_digodo_fundo: string;
  Setor: string;
  Preco_Atual: number;
  Liquidez_Diaria: number;
  Dividendo: number;
  DividendYield: number;
  DY_3M_Acumulado: number;
  DY_6M_Acumulado: number;
  DY_12M_Acumulado: number;
  DY_3M_M_dia: number;
  DY_6M_M_dia: number;
  DY_12M_M_dia: number;
  DY_Ano: number;
  variacao_preco: number;
  Rentab_Periodo: number;
  Rentab_Acumulada: number;
  PatrimonioLiq: number;
  VPA: number;
  P_VPA: number;
  DYPatrimonial: number;
  VariacaoPatrimonial: number;
  Rentab_Patrimonio_Periodo: number;
  Rentab_Patr_Acumulada: number;
  VacanciaFisica: number;
  VacanciaFinanceira: number;
  QuantidadeAtivos: number;
  slug: string;
};

export default function Dashboard() {
  const [fiiData, setFiiData] = useState<FiiData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const storedFilterData = localStorage.getItem("filterData");
  const initialFilterData = storedFilterData
    ? JSON.parse(storedFilterData)
    : {
        pvp: "",
        dividendos: "",
        vacanciaFisica: "",
        vacanciaFinanceira: "",
      };
  const [filterData, setFilterData] = useState(initialFilterData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://x8ki-letl-twmt.n7.xano.io/api:R98tRgF0:v1/dados_fiis"
        );
        console.log(response.data)
        setFiiData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("filterData", JSON.stringify(filterData));
  }, [filterData]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsLoading(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    setFilterData({
      pvp: filterData.pvp,
      dividendos: filterData.dividendos,
      vacanciaFisica: filterData.vacanciaFisica,
      vacanciaFinanceira: filterData.vacanciaFinanceira,
    });

    // Após o salvamento dos dados, definir isLoading como false
    setIsLoading(false);
  };

  return (
    <>
      <div className="h-[140vh] bg-[#13141B]">
       
       <div className="md:d-none">
        <Header />
       </div>


        <div className="m-16 rounded p-16 bg-[#201F25]">
          <div className="container-fluid xs-container">

            <div className="row">
              <div className="col-lg-6">
                <h1 className="text-white mb-3 text-3xl text-left font-bold">Dashboard</h1>
              </div>

              <div className="col-lg-6">
                <div className="d-flex justify-end">
                  <button onClick={handleOpenModal} className="bg-blue-500 p-[10px] text-white font-semibold rounded">
                    Filtrar melhores FIIS
                  </button>
                </div>

              </div>

            </div>


            <div className="row">

              <div className="col-lg-3">
                <CardMenu />
              </div>

              <div className="col-lg-9">
                <FiiCards fiiData={fiiData} />

                <div className="row">

                  <div className="col-lg-6">
                    <CardGanhos />
                  </div>

                  <div className="col-lg-6">
                    <CardVisaoGeral />
                  </div>

                </div>

                <div className="col-lg-12">
                  <CardNoticias />
                </div>

              </div>

            </div>

          </div>


        </div>

      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleCloseModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-[#201F25] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-[#201F25] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex flex-col sm:items-start">

                  <div className="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-white">Filtrar melhores ações</h3>
                  </div>

                  <div className="w-100">
                    <form action="" className="w-100">
                      <label className="text-gray-400 py-4" htmlFor="">
                        P/VP - Quanto o mercado paga pela ação?
                        <br />
                        <input
                          onChange={(e) =>
                            setFilterData({ ...filterData, pvp: e.target.value })
                          }
                          className="w-[20vw] mt-2 p-2 outline-none border-0 bg-gray-600 text-white"
                          type="number"
                          placeholder="Ex.: 1"
                        />
                      </label>

                      <label className="text-gray-400 py-2" htmlFor="">
                        Quantos você quer receber de dividendos? (%)
                        <br />
                        <input
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const parsedValue = parseFloat(inputValue.replace(",", "."));

                            // Verificar se o valor é um número válido
                            if (!isNaN(parsedValue)) {
                              setFilterData({ ...filterData, dividendos: parsedValue });
                            }
                          }}
                          className="w-[20vw] mt-2 p-2 outline-none border-0 bg-gray-600 text-white"
                          type="text"
                          placeholder="Exemplo: 9%/ano"
                        />
                      </label>

                      <label className="text-gray-400 py-2" htmlFor="">
                        Vacância Física
                        <br />
                        <input
                          onChange={(e) =>
                            setFilterData({ ...filterData, vacanciaFisica: e.target.value })
                          }
                          className="w-[20vw] mt-2 p-2 outline-none border-0 bg-gray-600 text-white"
                          type="number"
                          placeholder="Ex.: 10%"
                        />
                      </label>


                      <label className="text-gray-400 py-2" htmlFor="">
                        Vacância Financeira
                        <br />
                        <input
                          onChange={(e) =>
                            setFilterData({ ...filterData, vacanciaFinanceira: e.target.value })
                          }
                          className="w-[20vw] mt-2 p-2 outline-none border-0 bg-gray-600 text-white"
                          type="number"
                          placeholder="Ex.: 10%"
                        />
                      </label>

                      <br />

                      <button type="submit" onSubmit={handleSubmit} className="bg-blue-500 p-[10px] text-white font-semibold rounded"> Filtrar melhores FIIS</button>

                    </form>

                  </div>

                </div>
              </div>
              <div className="bg-[#201F25] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white-600 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleCloseModal}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
