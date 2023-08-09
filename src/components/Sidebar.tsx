import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';


export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    let location = useLocation();

    useEffect(() => {
        console.log(location.pathname);
    }, [location])

    return (
        <div className={`border border-gray-800 py-4 px-2 ${isOpen ? 'w-[15%]' : 'w-[7%]'} ease-in-out duration-200`}>
            <div className="flex my-[5vh] mr-4 justify-end">
                <button
                    onClick={() => setIsOpen(!isOpen)}>
                    <img 
                        className="w-8 h-8"
                        src={isOpen ? "/assets/fechar-sidebar.png" : "/assets/abrir-sidebar.png"}
                        alt={isOpen ? "Fechar menu" : "Abrir menu"} />
                </button>
            </div>

            <div className="flex flex-col gap-6">
                <NavLink to="/dashboard">
                    <div className={`${String(location.pathname) === "/dashboard" && "bg-black rounded-lg" } duration-200`}>
                        <button className={`${String(location.pathname) === "/dashboard" ? "bg-[#D9D9D9] translate-x-1" : "hover:bg-[#D9D9D9]"} flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}>
                            <img className="w-11 h-11"  src="/assets/home.png" alt="Tela inicial" />
                            {
                                isOpen &&
                                <h3 className="whitespace-nowrap text-xl font-medium block">
                                    Home
                                </h3> 
                            } 
                        </button>
                    </div>
                </NavLink>

                <NavLink to="/carteira">
                    <div className={`${String(location.pathname) === "/carteira" && "bg-black rounded-lg" } duration-200`}>
                        <button className={`${String(location.pathname) === "/carteira" ? "bg-[#D9D9D9] translate-x-1" : "hover:bg-[#D9D9D9]"} flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}>
                            <img className="w-11 h-11"  src="/assets/carteira.png" alt="Tela de carteira" />
                            {
                                isOpen &&
                                <h3 className="whitespace-nowrap text-xl font-medium">
                                    Carteira
                                </h3> 
                            } 
                        </button>
                    </div>
                </NavLink>
                
                <NavLink to={'/gastos-pessoais'}>
                    <div className={`${String(location.pathname) === "/gastos-pessoais" && "bg-black rounded-lg" } duration-200`}>
                        <button className={`${String(location.pathname) === "/gastos-pessoais" ? "bg-[#D9D9D9] translate-x-1" : "hover:bg-[#D9D9D9]"} flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}>
                            <img className="w-11 h-11"  src="/assets/renda.png" alt="Tela de renda variável" />
                            {
                                isOpen &&
                                <h3 className="whitespace-nowrap text-xl font-medium">
                                    Renda V.
                                </h3> 
                            } 
                        </button>
                    </div>
                </NavLink>

                <NavLink to={'/fiis'}>
                    <div className={`${String(location.pathname) === "/fiis" && "bg-black rounded-lg" } duration-200`}>
                        <button className={`${String(location.pathname) === "/fiis" ? "bg-[#D9D9D9] translate-x-1" : "hover:bg-[#D9D9D9]"} flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}>
                            <img className="w-11 h-11"  src="/assets/financas.png" alt="Tela de finanças" />
                            {
                                isOpen &&
                                <h3 className="whitespace-nowrap text-xl font-medium">
                                    Finanças
                                </h3> 
                            } 
                        </button>
                    </div>
                </NavLink>

                <NavLink to={'/acoes'}>
                    <div className={`${String(location.pathname) === "/acoes" && "bg-black rounded-lg" } duration-200`}>
                        <button className={`${String(location.pathname) === "/acoes" ? "bg-[#D9D9D9] translate-x-1" : "hover:bg-[#D9D9D9]"} flex items-center gap-5 w-[100%] py-2 px-3 rounded-lg duration-300`}>
                            <img className="w-11 h-11"  src="/assets/spread.png" alt="Tela de spread" />
                            {
                                isOpen &&
                                <h3 className="whitespace-nowrap text-xl font-medium">
                                    Spreads
                                </h3> 
                            } 
                        </button>
                    </div>
                </NavLink>
            </div>

        </div>
    );
}