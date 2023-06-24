import React from 'react';
import { Header } from '../components/Header';
import { CardMenu } from '../components/Dashboard/CardMenu';
import WebScrappingAcoes from '../components/Acoes/WebScrapping';
import Alert from '../components/Alert/alert';



export default function Alertas() {
  return (
    <div className="h-[120vh] bg-[#13141B]">

      <Header />


        <div className="m-16 rounded p-16 bg-[#201F25]">
          <div className="container-fluid">


        <div className="row">

        <div className="col-lg-3">
          <CardMenu />
        </div>

        <div className="col-lg-9">
            <Alert />
        </div>
      

        </div>

    </div>
    </div>
    </div>
  );
}