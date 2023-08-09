import { useEffect, useState } from "react";
import axios from 'axios';
import { CardMenu } from "../components/Dashboard/CardMenu";
import { CardGanhos } from "../components/Dashboard/CardGanhos";
import { CardVisaoGeral } from "../components/Dashboard/CardVisaoGeral";
import { CardNoticias } from "../components/Dashboard/CardNoticias";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';

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
  const [userName, setUserName] = useState('');
  const [acoes, setAcoes] = useState<any[]>([]);
  const [topAcoes, setTopAcoes] = useState<any[]>([]);

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = Cookies.get('token');
  //   if (!token) {
  //     logout();
  //     navigate('/login');
  //   }
  // }, [logout, navigate]);

  useEffect(() => {
    // Obtém o valor do cookie 'name'
    // const name = Cookies.get('name');
    // if (name) {
    //   setUserName(name);
    // }
    setUserName("Guilherme")
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

        acoesData.sort((a: any, b: any) => {
          if(a.change > b.change) return 1
        })

        console.log(acoesData);
        setTopAcoes(acoesData.slice(0,3))
      } catch (error) {
        console.log(error);
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
        <div className="flex flex-col col-span-9 row-span-3 bg-white px-4 py-2 rounded-lg">
          <h3 className="font-semibold text-lg">Favoritados</h3>
          <ul className="flex flex-row gap-3 overflow-auto no-scrollbar">
            {acoes.map((acao) => (
              <li key={acao.stock} className="flex justify-between text-white bg-[#EDEEF0] min-w-[20%] max-w-[22rem] p-3 rounded" >
                  <div className="flex flex-col item-start justify-between">
                    <div className="flex bg-black p-2 rounded-lg gap-2 items-center justify-between">
                      <img
                        className="w-5 h-5 rounded-sm"
                        src={acao.logo}
                        alt="Logo"
                      />
                      <p className="font-medium text-xs">{acao.name}</p>
                    </div>
                    <h2 className="font-semibold text-base text-black">
                      {Number(acao.change).toFixed(4)}
                    </h2>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-semibold text-[#5E5F64] text-sm">
                      {acao.stock}
                    </p>
                    <img
                      className="flex-1"
                      src="/assets/positive-rate.png"
                      alt="Ações com alta"
                    />
                  </div>
              </li>
            ))}
          </ul>
        </div> 
        <div className="col-span-5 row-span-4 bg-white px-4 py-3 rounded-lg">
            <div className="flex justify-between">
              <div className="flex flex-col justify-evenly items-start">
                <h1 className="font-medium text-4xl">
                  Bem-vindo, {userName}    
                </h1>
                <h2 className="font-medium text-xl text-[#5E5F64]">
                  Veja sua carteira
                </h2>
              </div>

              <div className="flex flex-col justify-between items-end">
                <div className="flex bg-[#D9D9D9] items-center p-1 rounded-lg w-[60%]">
                  <button className="flex flex-1 items-center justify-center bg-white p-1 rounded-lg">
                    <p>1</p>
                  </button>
                  <button className="flex flex-1 items-center justify-center p-1 rounded-lg">
                    <p>2</p>
                  </button>
                </div>
                <div className="bg-gradient-to-r from-[#FFDFA0] to-[#FDB52A] p-1 rounded-lg mt-4">
                  <span className="font-medium text-xl">
                    Nível Gold
                  </span>
                </div>
              </div>
            </div>
           
            
            <div className="flex flex-col gap-2 mt-2">
              <h1 className="font-medium text-3xl">
                R$999.999,99
              </h1>
              <div className="flex gap-1 w-[100%] h-3">
                <div className="rounded-lg bg-green-600 w-[60%]" />
                <div className="rounded-lg bg-yellow-600  w-[30%]" />
                <div className="rounded-lg bg-blue-600  w-[10%]"/>
              </div>
              <p>
                Continue investindo, realize o seu sonho
              </p>
            </div>
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
                    <div className="flex bg-[#28292B] w-[50%] py-1 px-3 rounded-lg items-center justify-center gap-2">
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
