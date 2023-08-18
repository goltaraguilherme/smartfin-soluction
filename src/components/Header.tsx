import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import styles from './Dashboard/Header.module.css';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import { useDarkTheme } from '../context/DarkThemeContext';

type AtivoProps = {
  stock: string,
  name: string
}

type StockData = {
  stock: string;
  name: string;
}

type StocksResponse = {
  stocks: StockData[];
}

type NotificationProps = {
  id: string,
  type: string,
  content: string,
  date: string
}

function useDebounceValue(value: string, time = 250){
  const [ debounceValue, setDebounceValue ] = useState<string>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, time)

  return () => {
    clearTimeout(timeout);
  }

  }, [value, time]);

  return debounceValue;
}

const notifications = [
  {
    id: '0',
    type: 'Contato',
    content: 'Contato',
    date: '07/08/2023',
  },
  {
    id: '1',
    type: 'Contato',
    content: 'Contato',
    date: '07/08/2023',
  },
  {
    id: '2',
    type: 'Alerta',
    content: 'CPLE4 atingiu o preço desejado, vamos negociar?',
    date: '07/08/2023',
  }
]

export const Header = () => {
  
  const navigate = useNavigate();
  
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [notificationsList, setNotifications] = useState<Array<NotificationProps>>(notifications);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [switchToggleDarkMode, setSwitchToggleDarkMode] = useState<boolean>(false);
  const [darkToggle, setDarkToggle] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>();
  const [inputText, setInputText] = useState<string>("");
  const [sugestoesAtivos, setSugestoesAtivos] = useState<AtivoProps[]>()
  const debounceQuery = useDebounceValue(inputText);

  const { isDark, toggleDarkMode } = useDarkTheme();

  let location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Obtém o valor do cookie 'name'
    const name = Cookies.get('name');
    if (name) {
      setUserName(name.split(' ')[0]);
    }
  }, []);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
    setNotificationsOpen(false);
  };

  const handleLogout = () => {

    navigate('/login')
    window.location.reload();
 
  Cookies.remove("token");
  Cookies.remove('name');
  Cookies.remove('email');

  // Remove o token do localStorage
  localStorage.removeItem('token');

    // Redireciona para a página de login (ou outra rota desejada)
    
  };

  async function fetchSugestoesAtivos(nomeAtivo: string){
    try {
      const response = await axios.get<StocksResponse>(
        `https://brapi.dev/api/quote/list?search=${nomeAtivo}`
      );
      setSugestoesAtivos(response.data.stocks);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (debounceQuery) fetchSugestoesAtivos(debounceQuery);
    if(debounceQuery == "") setSugestoesAtivos([])

  }, [debounceQuery]);

  return (
    <div className={`${isDark && 'dark'}`}>
      <header className={`bg-[#ffffff] flex h-[9vh] w-[100%] dark:bg-[#1C1D1F] ${styles.headerDesktop}`}>
        <div className="flex items-center justify-between w-[100%] px-6">
          <div className="flex w-[15%] justify-center items-center">
            <h4 className="font-bold text-lg capitalize dark:text-[#EDEEF0]">{location.pathname.split('/').slice(1)[0]}</h4>
          </div>

          {/* Input */}
          <div className="w-[35%] flex flex-col">
            <div className="bg-[#E1E3E6] flex items-center py-2 px-3 rounded-lg dark:bg-[#5E5F64]">
              <img className="w-7 h-7" src="/assets/Search.png" alt="Buscar" />
              <input
                className="bg-transparent w-[100%] ml-2 text-[#5E5F64] outline-none text-sm placeholder:text-[#5E5F64] dark:placeholder:text-[#EDEEF0] dark:text-[#EDEEF0]"
                type="text"
                placeholder="Pesquise por uma ação"
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
              />
            </div>
            {sugestoesAtivos && sugestoesAtivos?.length > 0 && (
              <div className="absolute mt-5 px-2 bg-white border border-gray-200 rounded shadow z-2">
                <ul className="mt-2">
                  {sugestoesAtivos?.slice(0, 5).map((ativo: AtivoProps) => (
                    <li
                      key={ativo.stock}
                      className="cursor-pointer text-gray-700 text-sm font-medium hover:bg-gray-200 px-4 py-2 rounded-md"
                      onClick={() => {
                        setInputText(`${ativo.stock} - ${ativo.name}`)
                        setSugestoesAtivos([])
                      }}
                    >
                      {ativo.stock} - {ativo.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Notificações */}
          <div className="flex items-end gap-2">
            <div className="flex flex-col">
              {notifications.length > 0 && (
                <span className="w-4 h-4 bg-red-600 rounded-lg text-white font-semibold flex items-center justify-center self-end text-sm translate-y-2">
                  {notifications.length}
                </span>
              )}
              <button
                className="bg-[#E1E3E6] items-center rounded-lg py-2 px-2 dark:bg-[#5E5F64]"
                onClick={toggleNotifications}
              >
                <img
                  className="w-5 h-5"
                  src="/assets/mensagens.png"
                  alt="Caixa de entrada"
                />
              </button>
            </div>

            {notificationsOpen && (
              <ul className="absolute right-[10%] top-[8%] mt-2 p-4 w-[30%] bg-white border border-gray-200 rounded shadow z-2">
                <p className="text-black text-[18px]">Oba! Alerta Novo</p>
              </ul>
            )}
            <div className="flex flex-col">
              {!true && (
                <span className="w-4 h-4 bg-red-600 rounded-lg text-white flex items-center justify-center self-end text-sm translate-y-2">
                  1
                </span>
              )}

              <button
                className="bg-[#E1E3E6] items-center rounded-lg py-2 px-2 dark:bg-[#5E5F64]"
                onClick={toggleNotifications}
              >
                <img
                  className="w-5 h-5"
                  src="/assets/notificacoes.png"
                  alt="Caixa de entrada"
                />
              </button>
            </div>

            {notificationsOpen && (
              <ul className="absolute right-[10%] top-[8%] mt-2 p-4 w-[30%] bg-white border border-gray-200 rounded shadow z-2">
                {notifications.map((notification: NotificationProps) => {
                  return(
                    <li key={notification.id} className="flex justify-between items-center mt-3 gap-3 cursor-default">
                      <div className="bg-black w-12 h-12 rounded-full flex items-center justify-center">
                        <img 
                          src={`${notification.type === "Contato" ? "/assets/iconContact.png" : "/assets/iconAlert.png"}`} 
                          alt={`${notification.type === "Contato" ? "Notificação de contato" : "Notificação de alerta"}`} 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">
                          {notification.type}
                        </h3>
                        <div className="bg-black h-[1px] m-[3px]" />
                        <p className="font-light text-xs">
                          {notification.content}
                        </p>
                      </div>
                      <div className="flex h-12 justify-start items-start">
                        <h4 className="font-semibold text-xs">
                          {notification.date}
                        </h4>
                      </div>
                      
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div>
            <button 
              className={`flex p-1 ml-4 self-center w-14 rounded-3xl items-center ${isDark ? "bg-[#141414]" : "bg-[#EDEEF0]"} duration-200`}
              onClick={() => {
                toggleDarkMode()
                setDarkToggle(!darkToggle)
                localStorage.setItem("darkMode", JSON.stringify(!darkToggle))
                setSwitchToggleDarkMode(!switchToggleDarkMode)}}
                >
              <div className={`flex justify-center items-center h-6 w-6 rounded-full ${isDark ? "translate-x-full bg-[#EDEEF0]" : "justify-start bg-[#28292B]"} duration-200`}>
                <img src={`${isDark ? "/assets/moon.png" : "/assets/sun.png"}`} alt="Alterar tema" />
              </div>
            </button>
          </div>

          {/* User */}
          <div className="relative">
            <button
              className="bg-[#EDEEF0] flex items-center gap-2 rounded-lg py-2 px-2 justify-end dark:bg-[#5E5F64]"
              onClick={toggleUserDropdown}
            >
              <img
                className="w-12 h-12"
                src="/avatar.png"
                alt="Foto de perfil"
              />
              <h4 className="font-bold dark:text-[#EDEEF0]">{userName}</h4>
            </button>
            {userDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow">
                <li className="py-2 px-4 hover:bg-gray-100">
                  <Link to="/meu-perfil">Meu perfil</Link>
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <button onClick={handleLogout}>Desconectar</button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </header>

      <nav
        className={`bg-gray-900 text-white py-4 px-6 ${styles.headerMobile}`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Meu Site</h1>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
          <div className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Página 1
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Página 2
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Página 3
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Página 4
                </a>
              </li>
            </ul>
          </div>
        </div>
        {isOpen && (
          <div className="mt-4">
            <ul className="flex flex-col space-y-2">
              <li>
                <a href="#" className="block hover:text-gray-300">
                  Página 1
                </a>
              </li>
              <li>
                <a href="#" className="block hover:text-gray-300">
                  Página 2
                </a>
              </li>
              <li>
                <a href="#" className="block hover:text-gray-300">
                  Página 3
                </a>
              </li>
              <li>
                <a href="#" className="block hover:text-gray-300">
                  Página 4
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};
