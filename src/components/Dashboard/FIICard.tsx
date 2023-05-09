import ReactApexChart from "react-apexcharts";
import { FiiData } from "../../pages/Dashboard";
import { ApexOptions } from "apexcharts";
import SwiperCore, { Pagination, Navigation, Autoplay } from 'swiper';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from "react";


type FiiCardsProps = {
  fiiData: FiiData[];
};

function formatarNumeroBRL(numero: number): string {
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function FiiCards(props: FiiCardsProps) {
  const { fiiData } = props;


  SwiperCore.use([Autoplay, Navigation, Pagination]);


  return (
    <div className="flex column-xs border border-gray rounded p-4 ">
   
   <Swiper
      slidesPerView={4}
      spaceBetween={10}

      loop={true}
      autoplay={{delay: 2000}}
      className="mySwiper"
    >
      {fiiData.map((fii) => (
        <SwiperSlide key={fii.id}>
          <div className="rounded mx-1 p-3 w-[100%] bg-[#23242F]">
            <div className="flex items-start justify-between">
              <div className="">
                <h2 className="text-white font-bold">{fii.C_digodo_fundo}</h2>
                <p className="text-[#01E59B] font-medium text-2xl">{fii.Rentab_Periodo}%</p>
              </div>
              <div className="">
                <p className="text-[#01E59B] font-medium">{formatarNumeroBRL(fii.Preco_Atual)}</p>
              </div>
            </div>
            <div className="pt-3">
              <p className="text-[#A4A4A4] uppercase">{fii.Setor}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
      
    </div>
  );
}

export default FiiCards;
