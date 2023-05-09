import { FiiData } from "../../pages/Dashboard";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import ReactPaginate from 'react-paginate';
import './rendaVariavel.css'
import { Link, useParams } from 'react-router-dom';


type FiiCardsProps = {
  fiiData: FiiData[];
};

function formatarNumeroBRL(numero: number): string {
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Fii(props: FiiCardsProps) {
  const { fiiData } = props;
  const [filtroSetor, setFiltroSetor] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const { slug } = useParams<{ slug: string }>();

  const handleFiltroSetorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroSetor(event.target.value);
    setPageNumber(0);
  };

  const fiiPorPagina = 9;
  const paginasVisitadas = pageNumber * fiiPorPagina;
  const registrosDaPagina = fiiData
    .filter((fii) => {
      if (filtroSetor === "") {
        return true;
      }
      return fii.Setor === filtroSetor;
    });


  const pageCount = Math.ceil(registrosDaPagina.length / fiiPorPagina);

  const handleChangePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };



  return (
<>

<div className="flex justify-center mb-3">
        <label className="mr-2 text-white">Filtrar por setor:</label>
        <select className="p-1 bg-gray-800 text-white" value={filtroSetor} onChange={handleFiltroSetorChange}>
          <option value="">Todos</option>
          <option value="Shoppings">Shopping</option>
          <option value="Lajes Corporativas">Lajes Corporativas</option>
          <option value="Logística">Logística</option>
          <option value="Hospital">Hospital</option>
          <option value="Hotel">Hotel</option>
          <option value="Agência">Agência</option>
          <option value="Residencial">Residencial</option>
          <option value="Industrial">Industrial</option>
          <option value="Comercial">Comercial</option>
          <option value="Educacional">Educacional</option>
          <option value="Híbrido">Híbrido</option>
          <option value="Papéis">Papéis</option>
        </select>
      </div>
    



    <div className="border border-gray rounded p-4 w-[100%]">
   
    <h2 className="text-xl text-white font-medium text-center mb-5">{filtroSetor === "" ? "Todos os setores" : `Setor: ${filtroSetor}`}</h2>
    
    <div className="flex flex-wrap gap-[10%]">
    {registrosDaPagina
        .slice(paginasVisitadas, paginasVisitadas + fiiPorPagina)
        .map((fii) => (
          <div className="rounded mx-1 my-2 p-3 w-[25%] bg-[#23242F]" key={fii.id}>
            <div className="flex items-start justify-between">
              <div className="">
                <h2 className="text-white font-bold">{fii.C_digodo_fundo}</h2>
                <p className="text-[#01E59B] font-medium text-2xl">{fii.Rentab_Periodo}%</p>
              </div>

              <div className="">
                <p className="text-[#01E59B] font-medium">{formatarNumeroBRL(fii.VariacaoPatrimonial)}</p>
              </div>
            </div>

            <div className="pt-3">
              <p className="text-[#A4A4A4] uppercase">{fii.Setor}</p>
            </div>

            <div>
              <Link className="text-white" to={`/fii/${slug}`}>Saiba mais</Link>
            </div>

          </div>
        ))}
    </div>
   

    </div>

    {pageCount > 1 && (
      <div className="flex justify-center items-center mt-5">
    <ReactPaginate
      previousLabel="Anterior"
      nextLabel="Próximo"
      breakLabel="..."
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handleChangePage}
      containerClassName={"pagination"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      activeClassName={"active"}
      breakClassName={"page-item disabled"}
      breakLinkClassName={"page-link"}
    />
      </div>
    )}

  </>
  );
}

export default Fii;
