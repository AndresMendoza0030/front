import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [roles, setRoles] = useState([]); // Ahora es un array
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Nuevo estado para almacenar el correo electrónico

    // Función para manejar el inicio de sesión
    const login = (userRoles, authToken, userName, userEmail) => {
        setLoggedIn(true);
        setRoles(userRoles); // Maneja los roles como un array
        setToken(authToken); // Almacena el token en el estado
        setUsername(userName); // Almacena el nombre de usuario en el estado
        setEmail(userEmail); // Almacena el correo electrónico en el estado
    };

    // Función para manejar el cierre de sesión
    const logout = () => {
        setLoggedIn(false);
        setRoles([]); // Restablece los roles a un array vacío
        setToken(null); // Elimina el token del estado
        setUsername(''); // Elimina el nombre de usuario del estado
        setEmail(''); // Elimina el correo electrónico del estado
    };

    return (
        <AuthContext.Provider value={{ loggedIn, roles, token, username, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
