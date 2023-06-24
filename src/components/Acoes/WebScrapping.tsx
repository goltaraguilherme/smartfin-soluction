import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import cheerio from 'cheerio';

export default function WebScrappingAcoes() {
  const { slug } = useParams<{ slug: string }>();
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerSubtitle, setHeaderSubtitle] = useState('');
  const [cotacaoTitle, setCotacaoTitle] = useState('');
  const [cotacaoSubtitle, setCotacaoSubtitle] = useState('');
  const [cotacaoData, setCotacaoData] = useState<{ label: string; value: string }[]>([]);
  const [indicadoresTitle, setIndicadoresTitle] = useState('');
  const [indicadoresSubtitle, setIndicadoresSubtitle] = useState('');
  const [indicadoresData, setIndicadoresData] = useState<{ label: string; value: string; id: string }[]>([]);


  useEffect(() => {
    const fetchScrapingData = async () => {
      try {
        if (!slug) {
          return; // Retorna caso a slug seja undefined
        }

        const url = `https://www.analisedeacoes.com/acoes/${encodeURIComponent(slug)}`;
        const response = await axios.get(url);
        const html = response.data;

        // Parse do HTML utilizando o Cheerio
        const $ = cheerio.load(html);

        // Obtenção do texto do header-left
        const headerTitleText = $('.header-left .title').text();
        const headerSubtitleText = $('.header-left .subtitle').text();
        setHeaderTitle(headerTitleText);
        setHeaderSubtitle(headerSubtitleText);

        // Remoção da <div class="collapse-item" id="lilu5z6wwdolgwz8gck"> do #cotacao
        $('#cotacao .section-price-historical').remove();

        // Obtenção do texto do #cotacao
        const cotacaoTitleText = $('#cotacao .title').text();
        const cotacaoSubtitleText = $('#cotacao .subtitle').text();
        setCotacaoTitle(cotacaoTitleText);
        setCotacaoSubtitle(cotacaoSubtitleText);

        // Obtenção dos dados de .card-info-item no #cotacao
        const cotacaoDataItems = $('#cotacao .card-info-item').map((index, element) => {
          const label = $(element).find('.item-label').text();
          const value = $(element).find('.item-value').text();
          return { label, value };
        }).get();
        setCotacaoData(cotacaoDataItems);

        // Obtenção do texto do #indicadores
        const indicadoresTitleText = $('#indicadores .title').text();
        const indicadoresSubtitleText = $('#indicadores .subtitle').text();
        setIndicadoresTitle(indicadoresTitleText);
        setIndicadoresSubtitle(indicadoresSubtitleText);

        // Obtenção dos dados de .card-info-item no #indicadores
        const indicadoresDataItems = $('#indicadores .card-info-item').map((index, element) => {
          const label = $(element).find('.item-label').text();
          const valueString = $(element).find('.item-value').text();
          const value = $(element).find('.item-value').text();
          const id = label;
          return { label, value, id };
        }).get();
        setIndicadoresData(indicadoresDataItems);
      } catch (error) {
        console.log(error);
      }
    };

    fetchScrapingData();
  }, [slug]);

  return (
    <div className='bg-[#23242F] border border-solid border-[#fff] text-white p-8 rounded'>
      <div className='flex flex-col text-2xl'>
        <p className='font-bold'>{headerTitle}</p>
        <p className='font-light'>{headerSubtitle}</p>
      </div>

      <div className='bg-gray-700 rounded p-4 text-white my-2 mx-1 mt-4 '>
        <h2 className='font-bold text-2xl'>Cotação</h2>
        <p className='font-light'>{cotacaoTitle}</p>
 
        <ul className='flex'>
          {cotacaoData.map((item, index) => (
            <li className='bg-gray-800 w-[30%] p-4 mx-1 rounded my-2' key={index}>
              <span className='text-[18px] font-thin'>{item.label}: </span>
              <span className='font-regular' style={{ color:  parseFloat(item.value) < 0 ? 'red' : '#01E59B', fontWeight: '700' }}>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className='bg-gray-700 rounded p-4 text-white my-4 mx-1'>
        <h2 className='font-bold text-2xl'>Indicadores</h2>
        <p className='font-light'>{indicadoresTitle}</p>
        <ul className='flex flex-wrap justify-around gap-4 pt-4'>
          {indicadoresData.map((item) => (
            <li className='bg-gray-800 w-[30%] p-4 rounded text-center' key={item.id} id={`card-info-indicador ${item.label}`}>
              <span className='text-1xl font-thin text-[18px]'>{item.label}: </span>
              <br />
              <span className=''  style={{ color:  parseFloat(item.value) < 0 ? 'red' : '#01E59B', fontWeight: '700', fontSize: '20px' }}>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
