import React from 'react';
import Rpm from './Rpm';


export const CardVisaoGeral = () => {
  return (
    <div className='border border-gray mt-4 rounded h-[100%] p-4 text-white font-bold'>
      <h3>Rentabilidade</h3>

      <p className='text-[#909090] font-normal'>Diário - 21/06/2023</p>

      <span className="text-2xl mt-3">9,04%</span>

    <div className="mt-10">
      <Rpm />
    </div>


    </div>
  );
}