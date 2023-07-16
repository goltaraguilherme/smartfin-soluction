import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';

export interface AcaoData {
  stock: string;
  name: string;
  close: number;
  change: number;
  volume: number;
  market_cap: number;
  logo: string;
  sector: string;
}

export const AcoesArea = () => {
  const navigate = useNavigate();
  const [acoes, setAcoes] = useState<AcaoData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const ITEMS_PER_PAGE = 9;
  const MAX_PAGE_ITEMS = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ stocks: AcaoData[] }>('https://brapi.dev/api/quote/list');
        const data = response.data.stocks;
        setAcoes(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const getAnaliseAcaoUrl = (slug: string) => {
    return `/acoes/${slug.toLowerCase()}`;
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredAcoes = acoes.filter((acao) =>
    acao.stock.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;
  const currentAcoes = filteredAcoes.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredAcoes.length / ITEMS_PER_PAGE);
  const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_ITEMS / 2));
  const endPage = Math.min(startPage + MAX_PAGE_ITEMS - 1, totalPages);

  const pageItems = Array(endPage - startPage + 1)
    .fill(0)
    .map((_, index) => startPage + index);

  const handleAcaoClick = (slug: string) => {
    navigate(`/acoes/${slug.toLowerCase()}`);
  };

  return (
    <div className='border border-solid border-[#fff] rounded p-4'>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Buscar ativo'
          className='border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className='row'>
        {currentAcoes.length > 0 ? (
          currentAcoes.map((acao) => (
            <div key={acao.stock} className='col-lg-4'>
              <div className='text-white bg-[#23242F] p-10 my-2 rounded'>
                <div className='flex justify-between align-center'>
                  <div>
                    <p className='font-bold'>{acao.stock}</p>
                    <h1 className='text-left'>{acao.name}</h1>
                  </div>
                  <div>
                    <img className='w-[80%] max-w-sm rounded' src={acao.logo} alt='Logo' />
                  </div>
                </div>

                <div className='flex justify-between align-center w-[100%] pt-4'>
                  <div>
                    <p>R${acao.close}</p>
                  </div>
                  <div>
                    <p style={{ color: acao.change < 0 ? 'red' : '#01E59B', fontWeight: '700' }}>
                      {acao.change}%
                    </p>
                  </div>
                </div>

                <div>
                  <button onClick={() => handleAcaoClick(acao.stock)}>Saiba mais</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-white'>Nenhum ativo encontrado.</div>
        )}
      </div>
      {filteredAcoes.length > ITEMS_PER_PAGE && (
        <Pagination className='mt-4'>
          <Pagination.First onClick={() => handlePageClick(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} />

          {pageItems.map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </div>
  );
};
