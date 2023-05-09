

export const Header = () => {
  return (
    <header className="bg-transparent flex justify-between items-center px-4 w-100 py-4">
    <div className='container pt-1 flex justify-between'>
      <div className="logo">
          <img className="img-fluid" src="../../../public/smartfinSoluction.png"/>
      </div>

      <div> 
          <input className="w-[20vw] border-0 outline-0 rounded p-2 bg-gray-800 color-t" type="search" placeholder="Pesquise por ativos, noticias e muito mais..."/>
      </div>
    
      </div>
    <div>
      </div>
  </header>
  );
}