import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import axios from 'axios';

type StockTicker = {
  symbol: string;
  name: string;
  exchange: string;
  assetType: string;
  ipoDate: string;
  delistingDate: string;
  status: string;
};

export default function GanhoAcoes() {
  const [action1, setAction1] = useState('');
  const [composition1, setComposition1] = useState('');
  const [startDate, setStartDate] = useState('');
  const [spread, setSpread] = useState('');
  const [action2, setAction2] = useState('');
  const [composition2, setComposition2] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    // Lógica para filtrar os dados com base nos campos preenchidos
    // ...
  };


  const [tickers, setTickers] = useState<StockTicker[]>([]);

  useEffect(() => {
    const fetchStockTickers = async () => {
      try {
        const response = await axios.get<{ symbolsList: StockTicker[] }>(
          'https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=demo'
        );
        const { symbolsList } = response.data;

        console.log(response.data)

        setTickers(symbolsList);


      } catch (error) {
        console.error('Erro ao buscar os tickers das ações:', error);
      }
    };

    fetchStockTickers();
  }, []);



  return (
    <div className="h-[140vh] bg-[#13141B]">
    <Header />

    <div className="m-16 rounded p-16 bg-[#201F25]">
      <div className="container-fluid">

      <h1 className="text-white mb-3 text-3xl text-left font-bold">Ganho Ações</h1>

      <div className="row">
  
        <div className="col-lg-12">

        <form>
        <div>
          <label>Ação 1:</label>
          <select className='bg-gray-500 p-1 w-[100%]' value={action1} onChange={(e) => setAction1(e.target.value)}>
          {tickers && tickers.slice(0, 5).map((ticker) => (
            <option key={ticker.symbol} value={JSON.stringify(ticker)}>{ticker.symbol}</option>
          ))}
          {/* Adicione mais opções conforme necessário */}
        </select>
  </div>
        <div>
          <label>Composição 1:</label>
          <input type="text" value={composition1} onChange={(e) => setComposition1(e.target.value)} />
        </div>
        <div>
          <label>Data de Início:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>Spread da Operação:</label>
          <input type="number" value={spread} onChange={(e) => setSpread(e.target.value)} />
        </div>
        <div>
          <label>Ação 2:</label>
          <input type="text" value={action2} onChange={(e) => setAction2(e.target.value)} />
        </div>
        <div>
          <label>Composição 2:</label>
          <input type="text" value={composition2} onChange={(e) => setComposition2(e.target.value)} />
        </div>
        <div>
          <label>Data de Fim:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button type="button" onClick={handleFilter}>Filtrar</button>
      </form>


        </div>

      </div>

      </div>

      </div>


    </div>

  );
};
