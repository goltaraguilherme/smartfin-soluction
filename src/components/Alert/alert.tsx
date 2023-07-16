import React, { useEffect, useState } from 'react';

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

export interface Alerta {
  acao: string;
  gatilho: string;
  precoAlvo: number;
}

const enviarNotificacaoPorEmail = (alerta: Alerta) => {
  // Implemente a lógica de envio de notificação por e-mail aqui
  console.log('Enviando notificação por e-mail:', alerta);
};

const enviarNotificacaoPorWhatsApp = (alerta: Alerta) => {
  // Implemente a lógica de envio de notificação por WhatsApp aqui
  console.log('Enviando notificação por WhatsApp:', alerta);
};

const enviarNotificacaoPorSMS = (alerta: Alerta) => {
  // Implemente a lógica de envio de notificação por SMS aqui
  console.log('Enviando notificação por SMS:', alerta);
};

export default function Alert() {
  const [acoes, setAcoes] = useState<AcaoData[]>([]);
  const [acaoSelecionada, setAcaoSelecionada] = useState<string>('');
  const [gatilhoSelecionado, setGatilhoSelecionado] = useState<string>('');
  const [precoAlvo, setPrecoAlvo] = useState<number | undefined>(undefined);
  const [alertasSalvos, setAlertasSalvos] = useState<Alerta[]>([]);
  const [alertaCriado, setAlertaCriado] = useState<boolean>(false);
  const [cotacaoAtual, setCotacaoAtual] = useState<number | undefined>(undefined);
  const [modalAberto, setModalAberto] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://brapi.dev/api/quote/list');
        const data = await response.json();
        setAcoes(data.stocks);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const acao = acoes.find((acao) => acao.stock === acaoSelecionada);
    setCotacaoAtual(acao?.close);
  }, [acaoSelecionada]);

  const handleAcaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAcaoSelecionada(event.target.value);
  };

  const handleGatilhoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGatilhoSelecionado(event.target.value);
  };

  const handlePrecoAlvoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setPrecoAlvo(isNaN(value) ? undefined : value);
  };

  const handleSalvarClick = async () => {
    const novoAlerta: Alerta = {
      acao: acaoSelecionada,
      gatilho: gatilhoSelecionado,
      precoAlvo: precoAlvo || 0,
    };

    setAlertasSalvos([...alertasSalvos, novoAlerta]);
    setAlertaCriado(true);
    setTimeout(() => {
      setAlertaCriado(false);
    }, 5000);

    try {
      const response = await fetch('https://smartfinsoluction-backend.vercel.app/alerta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoAlerta),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar o alerta.');
      }

      console.log('Alerta cadastrado com sucesso!');
    } catch (error) {
      console.log(error);
    }
  };

  const handleAbrirModal = () => {
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setAcaoSelecionada('');
    setGatilhoSelecionado('');
    setPrecoAlvo(undefined);
  };

  useEffect(() => {
    const verificarPrecoAlvo = (acao: AcaoData, alerta: Alerta) => {
      if (acao.close && acao.close >= alerta.precoAlvo) {
        console.log('Preço alvo atingido:', acao.stock);
        enviarNotificacaoPorEmail(alerta);
        enviarNotificacaoPorWhatsApp(alerta);
        enviarNotificacaoPorSMS(alerta);
      }
    };

    const interval = setInterval(() => {
      alertasSalvos.forEach((alerta) => {
        const acao = acoes.find((acao) => acao.stock === alerta.acao);
        if (acao) {
          verificarPrecoAlvo(acao, alerta);
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [acoes, alertasSalvos]);

  return (
    <div className='text-white p-4 rounded border border-white'>
      <button className='bg-blue-500 rounded font-bold p-2' onClick={handleAbrirModal}>
        Criar alerta
      </button>

      {modalAberto && (
        <div className='fixed inset-0 flex flex-col items-center justify-center z-50'>
          <div className='bg-gray-900 bg-opacity-80 absolute inset-0' onClick={handleFecharModal}></div>
          <div className='bg-gray-800 p-4 rounded z-10'>
            <h2 className='text-white text-lg font-bold mb-4'>Novo Alerta</h2>
            <div className='flex flex-col flex-wrap justify-start items-center'>
              <div className='mr-4 my-2 w-100'>
                <label className='text-white w-100'>Ativo</label>
                <br />
                <select
                  className='bg-gray-600 p-2 w-[100%] text-white rounded'
                  value={acaoSelecionada}
                  onChange={handleAcaoChange}
                >
                  <option value=''>Selecione</option>
                  {acoes.map((acao) => (
                    <option key={acao.stock} value={acao.stock}>
                      {acao.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mr-4 w-100'>
                <label className='text-white'>Cotação Atual</label>
                <br />
                <input
                  className='bg-gray-600 p-2 w-100 text-white rounded'
                  type='text'
                  value={cotacaoAtual !== undefined ? cotacaoAtual.toFixed(2) : ''}
                  readOnly
                />
              </div>
              <div className='mr-4 my-2 w-100'>
                <label className='text-white'>Gatilho</label>
                <br />
                <select
                  className='bg-gray-600 w-100 p-2 text-white rounded'
                  value={gatilhoSelecionado}
                  onChange={handleGatilhoChange}
                >
                  <option value=''>Selecione</option>
                  <option value='superior'>Quando o preço for superior a</option>
                  <option value='inferior'>Quando o preço for inferior a</option>
                </select>
              </div>
              <div className='w-100 my-2'>
                <label className='text-white'>Preço Alvo</label>
                <br />
                <input
                  className='bg-gray-600 p-2 w-100 text-white rounded'
                  type='number'
                  value={precoAlvo !== undefined ? precoAlvo : ''}
                  onChange={handlePrecoAlvoChange}
                />
              </div>
              <button
                className='bg-green-500 w-100 rounded font-bold p-2 my-2'
                onClick={handleSalvarClick}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {alertaCriado && (
        <div className='mt-4 p-2 bg-green-500 text-center'>
          Alerta criado com sucesso!
        </div>
      )}

      {alertasSalvos.length > 0 ? (
        alertasSalvos.map((alerta, index) => (
          <div key={index} className='mt-4 p-2 bg-gray-600'>
            <p>Ativo: {alerta.acao}</p>
            <p>Gatilho: {alerta.gatilho}</p>
            <p>Preço Alvo: {alerta.precoAlvo}</p>
          </div>
        ))
      ) : (
        <p className='mt-4 text-center'>Não há alertas...</p>
      )}
    </div>
  );
}
