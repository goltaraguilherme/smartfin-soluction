import ReactApexChart from "react-apexcharts";
import { FiiData } from "../../assets/pages/Dashboard";
import { ApexOptions } from "apexcharts";

type FiiCardsProps = {
  fiiData: FiiData[];
};

function formatarNumeroBRL(numero: number): string {
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function FiiCards(props: FiiCardsProps) {
  const { fiiData } = props;

  const chartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    series: [{
      name: "Variação do Preço",
      data: fiiData.slice(0, 12).map((fii) => fii.variacao_preco),
    }],
    title: {
      text: "Variação do Preço nos últimos 12 meses",
      align: 'left'
    },
    xaxis: {
      categories: fiiData.slice(0, 12).map((fii) => fii.C_digodo_fundo),
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return formatarNumeroBRL(val);
        }
      },
    },
  };

  return (
    <div className="flex column-xs border border-gray rounded p-4 w-[100%]">
   
      {fiiData.slice(0, 4).map((fii) => (
        <div className="rounded mx-1 p-3 w-[100%] bg-[#23242F]" key={fii.id}>

          <div className="flex items-start justify-between">
              <div className="">
              <h2 className="text-white font-bold">{fii.C_digodo_fundo}</h2>  
              <p className="text-[#01E59B] font-medium text-2xl">{fii.Rentab_Periodo}%</p>
              </div>

              <div className="">
                <p className="text-[#01E59B] font-medium">{fii.Rentab_Periodo}</p>
              </div> 
          </div>

          <div className="pt-3">
            <p className= "text-[#A4A4A4] uppercase">{fii.Setor}</p>
          </div>
        
          </div>
      ))}
      
    </div>
  );
}

export default FiiCards;
