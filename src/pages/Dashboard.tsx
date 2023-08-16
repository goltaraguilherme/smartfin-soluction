import { useEffect, useState } from "react";
import axios from 'axios';

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { CardFavoritos } from "../components/Dashboard/CardFavoritos";
import { CardMain } from "../components/Dashboard/CardMain";

type AcaoProps = {
  stock: string,
  logo: string,
  name: string,
  change: string,
  volume: string,
  sector: null | string
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
  const [acoesFiltradas, setAcoesFiltradas] = useState<AcaoProps[]>([]);
  const [acoesFavoritas, setAcoesFavoritas] = useState<AcaoProps[]>([]);
  
  const navigate = useNavigate();

  function handleFavorite(acao:AcaoProps){
    if(acoesFavoritas.find((item) => item.name == acao.name)){
      let indexAcao = acoesFavoritas.findIndex((item) => item.name == acao.name)
      let acoesFvoritasNew = [...acoesFavoritas];
      acoesFvoritasNew.splice(indexAcao, 1)
      setAcoesFavoritas(acoesFvoritasNew);
      localStorage.setItem("acoesFavoritas", JSON.stringify(acoesFvoritasNew));
    }else{
      setAcoesFavoritas([...acoesFavoritas, acao])
      localStorage.setItem("acoesFavoritas", JSON.stringify([...acoesFavoritas, acao]));
    }
  }

  useEffect(() => {
    // Obtém o valor do cookie 'name'
    const name = Cookies.get('name');
    if (name) {
      setUserName(name.split(' ')[0]);
    }
  }, []);

  useEffect(() => {
    let acoesFavoritasSalvas = localStorage.getItem("acoesFavoritas")!
    if (acoesFavoritasSalvas) setAcoesFavoritas(JSON.parse(acoesFavoritasSalvas))
    
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

        setAcoesFiltradas(acoesData)

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

  function handleSearchStock(e:any){
    setAcoesFiltradas(acoes.filter((acao) => acao.stock.toLowerCase().includes(e.target.value.toLowerCase())))
  }
  
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
            {acoesFavoritas?.length > 0 ?
                  acoesFavoritas.map((acao:AcaoProps, index) => (
                      <CardFavoritos acao={acao} key={String(index)} />
                  ))
                :
                <div className="flex flex-col flex-1 items-center justify-center">
                    <h3 className="font-semibold text-lg">
                      Você ainda não favoritou nenhuma ação
                    </h3>
                    <button
                      onClick={() => setIsModalOpen(true)} 
                      className="bg-[#0E0E19] rounded-lg py-2 px-3">
                      <h3 className="text-white">
                        Editar ativos favoritos
                      </h3>
                    </button>
                </div>
            }
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

      {
        isModalOpen &&
          <div className={`fixed inset-0  flex items-center justify-center bg-black bg-opacity-75 translate-y-[0%] z-10`}>
            <div className={`bg-[#EDEEF0] rounded-lg w-[40%] h-[70%] p-4 overflow-scroll no-scrollbar`}>
              <div className="flex items-center justify-center">
                <button onClick={() => {
                  setIsModalOpen(false)}}
                  >
                  <img src="/assets/seta-voltar.png" alt="Voltar" />
                </button>
                <h1 className="flex-1 text-center font-bold text-[#0E0E19] text-2xl">
                  Busque por um Ativo
                </h1>
              </div>
              <div className="flex gap-3 my-4">
                <div className="flex p-2 rounded-lg flex-1 border-gray-500 border-2 px-4">
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent text-[#0E0E19] placeholder-[#0E0E19] outline-none"
                    placeholder="Pesquisar por um Ativo"
                    onChange={(e) => handleSearchStock(e)}
                    />
                  <img src="/assets/buscar-lupa.png" alt="Buscar" />
                </div>
                <button className="flex items-center justify-center aspect-square p-2 border-gray-500 border-[1px] rounded-lg hover:bg-gray-300 duration-150 ease-out">
                    <img src="/assets/filtros.png" alt="Filtros" />
                </button>
              </div>
              <h3 className="font-bold text-[#0E0E19] text-lg">
                Ativos mais buscados
              </h3>
              <ul className="grid grid-cols-3 overflow-y-scroll no-scrollbar gap-3 mt-3">
                {
                  acoesFiltradas?.length > 0 ? 
                    acoesFiltradas?.map((acao, idx) => (
                      <li key={String(idx)} className="flex flex-col border-gray-500 border-2 rounded-xl justify-between">
                        <div className="flex p-3">
                          <div className="flex flex-col flex-1">
                            <h3 className="font-bold text-[#0E0E19] text-lg">
                              {acao.stock}
                            </h3>
                            <h4 className="text-[#0E0E19]">
                              {acao.name}
                            </h4>
                          </div>
                          <button className="items-start justify-start"
                            onClick={() => handleFavorite(acao)}>
                            <img 
                              className="w-9 h-9" 
                              src={`${(acoesFavoritas.find((item) => item.name == acao.name)) ? "/assets/removefav.png" : "/assets/Add.png"}`} 
                              alt="Favoritar ativo" 
                            />
                          </button>
                        </div>
                        <div className="h-[1px] bg-gray-500"/>
                        <div className="flex">
                          <div className="flex-1 flex-col p-3">
                            <h6 className="text-xs">
                              Volume
                            </h6>
                            <h5>
                              {(Number(acao.volume)/10e6).toFixed(2)}M
                            </h5>
                          </div>
                          <div className="flex-1 flex-col p-3">
                            <h6 className="text-xs">
                              D.Yield
                            </h6>
                            <h5>
                              9.51%
                            </h5>
                          </div>
                        </div>
                        <div className="flex items-center justify-center bg-[#262632] rounded-xl p-2 gap-3">
                          <h4
                            className={`font-semibold ${Number(acao.change) >= 0 ? "text-[#5DDF52]" : "text-[#FF2727]"}`}
                          >
                            {Number(acao.change) > 0 && "+"}
                            {Number(acao.change).toFixed(2)}%
                          </h4>
                          <img className={`${Number(acao.change) < 0 && "rotate-90"}`} src="/assets/seta-subida.png" alt="Ativo com alta" />
                        </div>
                      </li>
                  ))
                  :
                  <div className="col-span-3 mt-[20%]">
                     <h3 className="text-center font-bold text-[#0E0E19] text-xl">
                      Não foram encontrados ativos
                    </h3>
                  </div>
                  
                }
              </ul>
            </div>
          </div>
      }
      
    </>
  );
}


