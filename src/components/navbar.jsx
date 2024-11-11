import React, { useState, useEffect } from 'react';
import './navbar.css'
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const [active, setActive] = useState("nav__menu");
    const [toggleIcon, setToggleIcon] = useState("nav__toggler");
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Estado para controle de login
    const location = useLocation();  // Para pegar a rota atual

    useEffect(() => {
        // Verifica se o usuário está logado
        const userToken = localStorage.getItem('user_token');
        setIsLoggedIn(!!userToken);
    }, []);

    const navToggle = () => {
        active === 'nav__menu' ? setActive('nav__menu nav__active') : setActive('nav__menu');
        toggleIcon === 'nav_toggler' ? setToggleIcon('nav__toggler toggle') : setToggleIcon("nav__toggler");
    }

    return (
        <nav className='nav'>
            <div className="logo">
                <Link to="/" className="nav__brand" id='logo'>Receitas</Link>
            </div>
            <ul id='links' className={active}>
                <li className="nav__item"><Link to="/" className="nav__link">Home</Link></li>
                <li className="nav__item"><Link to="/sobre" className="nav__link">Como Funciona?</Link></li>

                {/* Exibe "Cadastro" e "Login" apenas se o usuário não estiver logado */}
                {!isLoggedIn && (
                    <>
                        <li className="nav__item"><Link to="/login" className="nav__link">Cadastro</Link></li>
                        <li className="nav__item"><Link to="/fzrlogin" className="nav__link">Login</Link></li>
                    </>
                )}

                <li className="nav__item"><Link to="/receitas" className="nav__link">Feed</Link></li>

                {/* Exibe "Publicar Receita" apenas se o usuário estiver logado e na rota "/receitas" */}
                {isLoggedIn && location.pathname === '/receitas' && (
                    <li className="nav__item">
                        <Link to="/criar" className="nav__link">Publicar Receita</Link>
                    </li>
                )}
            </ul>
            <div onClick={navToggle} className={toggleIcon}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </div>
        </nav>
    )
}

export default Navbar;
