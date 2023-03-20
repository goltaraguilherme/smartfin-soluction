import { CardMeusAtivos } from "../components/Carteira/CardMeusAtivos";
import { CardPatrimonio } from "../components/Carteira/CardPatrimõnio";
import { CardRentabilidade } from "../components/Carteira/CardRentabilidade";
import { CardMenu } from "../components/Dashboard/CardMenu";
import { Header } from "../components/Header";


export default function Carteira() {
  return (
    <div className="h-[140vh] bg-[#13141B]">
      <Header />

      <div className="m-16 rounded p-16 bg-[#201F25]">
        <div className="container-fluid">
           <div className="row">
            
            <h1 className="text-white mb-3 text-3xl font-bold">Carteira</h1>

            <div className="col-lg-3">
              <CardMenu />
            </div>

            <div className="col-lg-9">
              <div className="row">

              <div className="col-lg-6">
                  <CardPatrimonio />
              </div>

              <div className="col-lg-6">
                  <CardMeusAtivos />
              </div>

              <div className="col-lg-12">
                  <CardRentabilidade />
              </div>

              </div>
            </div>

          </div> 
        </div>
      </div>

    </div>
  );
}