import { Key } from "react"

type AcaoProps = {
    stock: string,
    logo: string,
    name: string,
    change: string
}

type ComponentProps = {
    acao: AcaoProps
    key: Key
}

export function CardFavoritos({ acao, key }: ComponentProps){

    return (
      <li key={key} className="flex justify-between text-white bg-[#EDEEF0] min-w-[20%] max-w-[22rem] p-3 rounded">
        <div className="flex flex-col item-start justify-between">
          <div className="flex bg-black p-2 rounded-lg gap-2 items-center justify-between">
            <img className="w-5 h-5 rounded-sm" src={acao.logo} alt="Logo" />
            <p className="font-medium text-xs">{acao.name}</p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-semibold text-sm text-[#5E5F64]">Carteira</h4>
            <h2 className="font-semibold text-lg text-black">0</h2>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <p className="font-semibold text-[#5E5F64] text-sm">{acao.stock}</p>
          <h2
            className={`font-bold text-sm ${
              Number(acao.change) >= 0 ? "text-[#5DDF52]" : "text-[#FF2727]"
            }`}
          >
            {Number(acao.change) > 0 && "+"}
            {Number(acao.change).toFixed(2)}%
          </h2>
          <img
            className={`flex-1 ${Number(acao.change) < 0 && "-scale-x-100"}`}
            src={`${
              Number(acao.change) < 0
                ? "/assets/negative-rate.png"
                : "/assets/positive-rate.png"
            }`}
            alt="Ações com alta"
          />
        </div>
      </li>
    );
}