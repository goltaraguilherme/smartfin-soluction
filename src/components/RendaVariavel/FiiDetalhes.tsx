import { useParams } from "react-router-dom";
import { FiiData } from "../../pages/Dashboard";

type FiiDetalhesProps = {
  fiiData: FiiData[];
};

function FiiDetalhes(props: FiiDetalhesProps) {
  const { id } = useParams<{ id: string }>();

  // Busca o FII correspondente com base no id
  const fii = props.fiiData.find((fii) => fii.id === Number(id));
  
  if (!fii) {
    // renderiza uma mensagem de erro caso não encontre o FII correspondente
    return <p className="text-black">Não foi possível encontrar o FII correspondente.</p>;
  }

  return (
    <div>
      <h1>{fii.C_digodo_fundo}</h1>
      <p>{fii.Setor}</p>
      <p>{fii.Rentab_Periodo}</p>
      <p>{fii.VariacaoPatrimonial}</p>
      {/* Adicione aqui mais detalhes sobre o FII que deseja mostrar */}
    </div>
  );
}

export default FiiDetalhes;
