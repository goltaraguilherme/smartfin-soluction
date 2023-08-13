import { useEffect, useState } from "react";
import axios from 'axios';

import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CardFavoritos } from "../components/Dashboard/CardFavoritos";
import { CardMain } from "../components/Dashboard/CardMain";

type AcaoProps = {
  stock: string,
  logo: string,
  name: string,
  change: string
}

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
  const [loadingAcoes, setLoadingAcoes] = useState<boolean>(true);
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
  const [userName, setUserName] = useState('');
  const [acoes, setAcoes] = useState<AcaoProps[]>([]);
  const [topAcoes, setTopAcoes] = useState<AcaoProps[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Obtém o valor do cookie 'name'
    const name = Cookies.get('name');
    if (name) {
      setUserName(name.split(' ')[0]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://x8ki-letl-twmt.n7.xano.io/api:R98tRgF0:v1/dados_fiis"
        );
        setFiiData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchAcoes = async () => {
      try {
        const response = await axios.get("https://brapi.dev/api/quote/list?limit=10");
        const acoesData = response.data.stocks;
        setAcoes(acoesData);
        
        let topAcoes = acoesData.sort((a: any, b: any) => {
          if(Number(a.change) > Number(b.change)) return -1
          else return 1
        }).slice(0,3)

        setTopAcoes(topAcoes)
        setLoadingAcoes(false);
      } catch (error) {
        console.log(error);
        setLoadingAcoes(false);
      }
    };

    fetchAcoes();
    
    console.log(acoes)
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
  
    // Redirecionar para a rota "/fiis/melhoresfiis" com os dados do filtro como parâmetros
    navigate(`/fiis/melhoresfiis/${encodeURIComponent(JSON.stringify(filterData))}`);
  };

  
  return (
    <>
      <div className="grid grid-cols-9 grid-rows-11 gap-2 h-[100%] w-[100%]">
        <div className="flex flex-col col-span-9 gap-2 row-span-3 bg-white px-4 py-2 rounded-lg">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">
              Favoritados
            </h3>
            <button 
              className="bg-[#0E0E19] rounded-lg p-2"
              onClick={() => {setIsModalOpen(true)}}>
              <h4 className="text-white">
                Editar
              </h4>
            </button>
          </div>
          
          <ul className="flex flex-row gap-3 overflow-auto no-scrollbar">
            {acoes.length > 0 && acoes.map((acao:AcaoProps, index) => (
                  <CardFavoritos acao={acao} key={String(index)} />
              ))}
          </ul>
        </div> 
        <div className="col-span-5 row-span-4 bg-white px-4 py-3 rounded-lg">
            <CardMain userName = {userName}/>
        </div>
          
        <div className="col-span-4 row-span-4 bg-white px-4 py-3 rounded-lg max-h-[34vh] overflow-y-scroll no-scrollbar">
            <h2 className="text-2xl">
              Últimas Operações
            </h2>
            <ul className="mt-2">
              <li className="flex bg-[#EDEEF0] gap-3 rounded-lg mt-2">
                <div className="flex bg-[#1C1D1F] rounded-lg p-2 w-[8%] aspect-square items-center justify-center">
                  <img src="/assets/saco-dinheiro.png" alt="Saco de dinheiro" />
                </div>
                <p className="flex-1 font-semibold text-sm p-1">
                  + 150 Ações de Copel (CPLE4) adicionadas a sua carteira de investimentos
                </p>
                <button className="flex bg-[#1C1D1F] rounded-lg p-2 w-[8%] aspect-square items-center justify-center">
                  <img src="/assets/seta-direita.png" alt="Seta para direita" />
                </button>
              </li>
              <li className="flex bg-[#EDEEF0] gap-3 rounded-lg mt-2">
                <div className="flex bg-[#1C1D1F] rounded-lg p-2 w-[8%] aspect-square items-center justify-center">
                  <img src="/assets/saco-dinheiro.png" alt="Saco de dinheiro" />
                </div>
                <p className="flex-1 font-semibold text-sm p-1">
                  + 150 Ações de Copel (CPLE4) adicionadas a sua carteira de investimentos
                </p>
                <button className="flex bg-[#1C1D1F] rounded-lg p-2 w-[8%] aspect-square items-center justify-center">
                  <img src="/assets/seta-direita.png" alt="Seta para direita" />
                </button>
              </li>
              <li className="flex bg-[#EDEEF0] gap-3 rounded-lg mt-2">
                <div className="flex bg-[#1C1D1F] rounded-lg p-2 w-[8%] aspect-square items-center justify-center">
                  <img src="/assets/saco-dinheiro.png" alt="Saco de dinheiro" />
                </div>
                <p className="flex-1 font-semibold text-sm p-1">
                  + 150 Ações de Copel (CPLE4) adicionadas a sua carteira de investimentos
                </p>
                <button className="flex bg-[#1C1D1F] rounded-lg p-2 w-[8%] aspect-square items-center justify-center">
                  <img src="/assets/seta-direita.png" alt="Seta para direita" />
                </button>
              </li>
              <li className="flex bg-[#EDEEF0] gap-3 rounded-lg mt-2">
                <div className="flex bg-[#1C1D1F] rounded-lg p-2 w-[8%] aspect-square items-center justify-center">
                  <img src="/assets/saco-dinheiro.png" alt="Saco de dinheiro" />
                </div>
                <p className="flex-1 font-semibold text-sm p-1">
                  + 150 Ações de Copel (CPLE4) adicionadas a sua carteira de investimentos
                </p>
                <button className="flex bg-[#1C1D1F] rounded-lg p-2 w-[8%] aspect-square items-center justify-center">
                  <img src="/assets/seta-direita.png" alt="Seta para direita" />
                </button>
              </li>
            </ul>
        </div>
          
        <div className="col-span-5 row-span-3 bg-white px-4 py-3 rounded-lg">
            <h3 className="font-semibold text-base">
              Maiores altas do dia
            </h3>
            <ul className="flex flex-col gap-1">
              {
                topAcoes.map((acao, idx) => {
                  return(
                    <li key={idx} className="flex items-center bg-[#EDEEF0] rounded-lg p-2">
                      <div className="flex items-center gap-2 w-[35%]">
                        <img className="rounded-full h-12 aspect-square" src={acao.logo} alt="Logo" />
                        <h4 className="font-bold text-base text-[#0E0E19]">
                          {acao.name}
                        </h4>
                      </div>
                      <h5 className="font-semibold text-sm text-[#96969C] w-[20%]">
                        {acao.stock}
                      </h5>
                      <div className="flex items-center gap-2 w-[20%]">
                        <div className={`py-1 px-3 rounded-lg ${Number(acao.change) >= 0 ? "bg-[#5DDF52]": "bg-[#FF2727]"}`}>
                          <img className={`${Number(acao.change) < 0 && "rotate-90"}`}
                            src="/assets/seta-subida.png" 
                            alt="Seta de crescimento" />
                        </div>
                        <p className={`font-semibold ${Number(acao.change) >= 0 ? "text-[#5DDF52]": "text-[#FF2727]"}`}>
                          {Number(acao.change) > 0 && ("+")}{Number(acao.change).toFixed(2)}%
                        </p>
                      </div>
                      <h4 className="font-bold text-base text-[#0E0E19]">
                        DY:
                      </h4>
                    </li>
                  )
                })
              }
            </ul>
        </div>
          
        <div className="flex col-span-4 row-span-3 gap-2 bg-white px-4 py-3 rounded-lg">
            <div className="flex-1">
              <div className="w-[100%]">
                <h2 className="font-semibold text-2xl text-[#1C1D1F]">
                  Performance de Carteira
                </h2>
              </div>

              <div className="flex flex-1 gap-2 h-[86%]">
                <div className="flex flex-col flex-1 justify-between">
                  <div className="flex flex-col flex-1 gap-3 mt-2 justify-center">
                    <h6 className="text-[#595959]">
                      Muito bom! continue
                    </h6>
                    <div className="flex bg-[#28292B] w-[50%] py-1 px-2 rounded-lg items-center justify-center gap-2">
                      <img src="/assets/seta-subida.png" alt="" />
                      <h4 className="text-[#5DDF52]">
                        +16,5%
                      </h4>
                    </div>
                    <h6 className="text-[#595959]">
                      Desempenho em<br/> ganho de ações
                    </h6>
                  </div>
                  <div className="flex gap-2 flex-1 items-end">
                    <div className="bg-[#058FF233] flex-1 h-[40%]  rounded-lg"/>
                    <div className="bg-[#058FF266] flex-1 h-[70%] rounded-lg"/>
                  </div>
                </div>
                <div className="flex flex-1 gap-2 items-end">
                  <div className="bg-[#058FF299] flex-1 h-[50%] rounded-lg"/>
                  <div className="bg-[#058FF2CC] flex-1 h-[70%] rounded-lg"/>
                </div>
              </div>
            </div>

            <div className="bg-[#058FF2] w-[18%] rounded-lg" />
        </div>
      </div>
    </>
  );
}


