import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineBell } from 'react-icons/ai';
import { RiArrowDownSLine } from 'react-icons/ri';
import { FaBars, FaTimes } from 'react-icons/fa';
import styles from './Dashboard/Header.module.css';
import Cookies from 'js-cookie';

export const Header = () => {
  
  const navigate = useNavigate();
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Obtém o valor do cookie 'name'
    const name = Cookies.get('name');
    if (name) {
      setUserName(name);
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
 
  Cookies.remove("token");
  Cookies.remove('userData');
    // Redireciona para a página de login (ou outra rota desejada)
    navigate('/')
    window.location.reload();

  };

  return (
    <>
      <header className={`bg-transparent flex justify-between items-center px-0 w-100 py-4 ${styles.headerDesktop}`}>
        <div className="container pt-1 flex justify-between">
          <div className="logo flex justify-start items-center">
            <Link to="/dashboard">
              <img className="img-fluid" src="../../../public/smartfinSoluction.png" alt="Logo" />
            </Link>
          </div>

          <div className="flex justify-end">
            <div>
              <span className="text-white text-[16px] flex items-center">
                <button
                  className="text-white flex items-center  text-[16px] focus:outline-none"
                  onClick={toggleNotifications}
                >
                  <AiOutlineBell className="text-[25px]" /> Notificações
                  <RiArrowDownSLine className="text-[18px]" />
                </button>

                {notificationsOpen && (
                  <ul className="absolute right-[10%] top-[8%] mt-2 p-4 w-[30%] bg-white border border-gray-200 rounded shadow">
                    <p className='text-black text-[18px]'>Oba! Alerta Novo</p>
                  </ul>
                )}
              </span>
            </div>

            <div className="pl-10">
              <div className="relative">
                <button
                  className="text-white flex items-center  text-[16px] focus:outline-none"
                  onClick={toggleUserDropdown}
                >
                  {userName} <RiArrowDownSLine className="text-[18px]" />
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
          </div>
        </div>
      </header>

      <nav className={`bg-gray-900 text-white py-4 px-6 ${styles.headerMobile}`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Meu Site</h1>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
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
    </>
  );
};
