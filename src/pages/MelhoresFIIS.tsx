import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { CardMenu } from '../components/Dashboard/CardMenu';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

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

type MelhoresFiisProps = {};

export default function MelhoresFiis(props: MelhoresFiisProps) {
  const { filterData } = useParams<{ filterData: string }>();
  const parsedFilterData = filterData ? JSON.parse(filterData) : null;

  const [filteredFiiData, setFilteredFiiData] = useState<FiiData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://x8ki-letl-twmt.n7.xano.io/api:R98tRgF0:v1/dados_fiis'
        );
        const allFiiData: FiiData[] = response.data;
        const filteredData = allFiiData.filter((fii: FiiData) => {
          return (
            fii.P_VPA <= parseFloat(parsedFilterData.pvp) &&
            fii.DY_Ano >= parseFloat(parsedFilterData.dividendos) &&
            fii.VacanciaFisica <= parseFloat(parsedFilterData.vacanciaFisica) &&
            fii.VacanciaFinanceira <= parseFloat(parsedFilterData.vacanciaFinanceira)
          );
        });
        setFilteredFiiData(filteredData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [parsedFilterData]);

  const handlePageChange = (selected: { selected: number }) => {
    setCurrentPage(selected.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredFiiData.slice(offset, offset + itemsPerPage);

  return (
    <div className="h-[140vh] bg-[#13141B]">
      <Header />
      <div className="m-16 rounded p-16 bg-[#201F25]">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <CardMenu />
            </div>
            <div className="col-lg-9">
              <div className="border border-solid border-[#fff] p-4 rounded">
                <div>
                  <h1 className="text-white text-3xl">
                    Oba! Esses são os melhores FIIs para você
                  </h1>
                </div>
                <div>
                  <div className="row py-10">
                    {currentPageData.map((fii) => (
                      <div key={fii.id} className="col-lg-4 my-2">
                        <div className="rounded mx-1 p-3 w-[100%] bg-[#23242F]">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-white font-bold">
                                {fii.C_digodo_fundo}
                              </h2>
                              <p className="text-[#01E59B] font-medium text-2xl">
                                {fii.DividendYield}%
                              </p>
                            </div>
                            <div>
                              <p className="text-[#01E59B] font-medium">
                                R${fii.Preco_Atual.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="pt-3">
                            <p className="text-[#A4A4A4] uppercase">{fii.Setor}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex py-10 justify-center">
                    <ReactPaginate
                      previousLabel={'<'}
                      nextLabel={'>'}
                      breakLabel={'...'}
                      pageCount={Math.ceil(filteredFiiData.length / itemsPerPage)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={2}
                      onPageChange={handlePageChange}
                      containerClassName={'pagination'}
                      activeClassName={'active'}
                      pageLinkClassName={'page-link'}
                      previousLinkClassName={'page-link'}
                      nextLinkClassName={'page-link'}
                      disabledClassName={'disabled'}
                      breakLinkClassName={'page-link'}
                    />
                  </div>
                  <div>
                    <p className="text-white">
                      *Essas informações são geradas através de parâmetros que você mesmo
                      criou.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
