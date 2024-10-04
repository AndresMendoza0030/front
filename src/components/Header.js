// src/components/Header.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación
import './BaseLayout.css'; 

const Header = () => {
  const { loggedIn, role, logout } = useAuth(); // Obtener estado de autenticación, rol y función de logout
  const navigate = useNavigate(); // Hook para redirección

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirige al usuario a la raíz
};

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/images/logo.webp" alt="Logo de la Organización" style={{ marginRight: '20px', height: '85px', width: 'auto' }} />
        <nav>
          <ul>
            <li>
              <Link to="/dashboard">Inicio</Link>
            </li>
            {loggedIn && (
              <>
                <li>
                  <i className="fa-solid fa-grip-lines-vertical separator-icon"></i>
                </li>
                <li>
                  <Link to="/documents">Mis Documentos</Link>
                </li>
                <li>
                  <i className="fa-solid fa-grip-lines-vertical separator-icon"></i>
                </li>
                {role === 'admin' && (
                  <>
                    <li>
                      <Link to="/audit">Auditoría</Link>
                    </li>
                    <li>
                      <i className="fa-solid fa-grip-lines-vertical separator-icon"></i>
                    </li>
                    <li>
                      <Link to="/backup">Respaldo</Link>
                    </li>
                    <li>
                      <i className="fa-solid fa-grip-lines-vertical separator-icon"></i>
                    </li>
                    <li>
                      <Link to="/config">Configuración</Link>
                    </li>
                    <li>
                      <i className="fa-solid fa-grip-lines-vertical separator-icon"></i>
                    </li>
                  </>
                )}
                <li>
                      <Link to="/config">Configuración</Link>
                    </li>
                    <li>
                      <i className="fa-solid fa-grip-lines-vertical separator-icon"></i>
                    </li>
                <li>
                  <Link to="/help">Ayuda</Link>
                </li>
                <li>
                  <i className="fa-solid fa-grip-lines-vertical separator-icon"></i>
                </li>
                <li>
                <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontFamily: 'Raleway, sans-serif',
                      fontSize:'medium',
                    }}
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            )}
            {!loggedIn && (
              <li>
                <Link to="/login">Iniciar Sesión</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
