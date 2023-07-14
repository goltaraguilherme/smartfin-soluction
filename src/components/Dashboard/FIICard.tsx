import ReactApexChart from "react-apexcharts";
import { FiiData } from "../../pages/Dashboard";
import { ApexOptions } from "apexcharts";
import SwiperCore, { Pagination, Navigation, Autoplay } from 'swiper';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRef, useState } from "react";


type FiiCardsProps = {
  fiiData: FiiData[];
};

function formatarNumeroBRL(numero: number): string {
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function FiiCards(props: FiiCardsProps) {
  const { fiiData } = props;

  const swiperRef = useRef<SwiperCore>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  const swiperOptions = {
    slidesPerView: 4,
    spaceBetween: 10,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    onSwiper: (swiper: SwiperCore) => {
      setSwiperInstance(swiper);
    },
  };

  const handleMouseEnter = () => {
    if (swiperInstance) {
      swiperInstance.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperInstance) {
      swiperInstance.autoplay.start();
    }
  };

  return (
    <div 
    className="flex column-xs border border-gray rounded p-4 "
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
   
   <Swiper
      {...swiperOptions}
      
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
