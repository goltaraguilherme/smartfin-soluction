import { FiiData } from "../../pages/Dashboard";
import { ApexOptions } from "apexcharts";

type FiiCardsProps = {
  fiiData: FiiData[];
};

function formatarNumeroBRL(numero: number): string {
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Fii(props: FiiCardsProps) {
  const { fiiData } = props;


  return (
    <div className="flex flex-wrap gap-[10%] border border-gray rounded p-4 w-[100%]">
   
      {fiiData.slice(0, 9).map((fii) => (
        <div className="rounded mx-1 my-2 p-3 w-[25%] bg-[#23242F]" key={fii.id}>

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

export default Fii;
