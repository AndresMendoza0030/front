// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Hook para manejar el inicio de sesión
    const { setPermissions } = usePermissions();
    const navigate = useNavigate(); // Hook para navegación

    useEffect(() => {
        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Datos recibidos del servidor:', data);

            console.log('Datos recibidos del servidor:', data);
            if (response.ok) {
                console.log('Login fue exitoso, ahora navegaremos al dashboard...');
                const { token, user, permissions, roles } = data.data;
                setPermissions(permissions);
                login(roles, token, user.name);
                navigate('/dashboard');
            } else {
                console.error('Login falló con mensaje:', data.message);
            }
            
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            alert('Error al iniciar sesión, verifica tus credenciales');
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            const idToken = response.credential;

            const result = await fetch('https://backend-production-5e0d.up.railway.app/auth/google/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            const data = await result.json();

            console.log('Datos recibidos del servidor (Google):', data);

            if (result.ok && data.data.token) {
                const { token, user, permissions, roles } = data.data;
                setPermissions(permissions);
                login(roles, token, user.name); // Pasa los roles al contexto de autenticación
                navigate('/dashboard');
            } else {
                throw new Error('Error al autenticar con la API');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar sesión con Google');
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Error:', error);
        alert('Error al iniciar sesión con Google');
    };

    // Función para redirigir a la página de recuperación de contraseña
    const handlePasswordRecovery = () => {
        navigate('/password-recovery'); // Redirige a la URL de recuperación de contraseña
    };

    return (
        

            <div className="login-container">
                <img src="images/logo.webp" alt="Logo de la Organización" />
                <h1>Bienvenid@ al Portal</h1>
                <p>Inicio de Sesión</p>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Iniciar Sesión</button>
            
                </form>
                <GoogleOAuthProvider clientId="3191715525-54lsdrhbk22k0dk2e6cdrlqk2derqcbj.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onFailure={handleGoogleFailure}
                /></GoogleOAuthProvider>
                <p>
                    <button
                        onClick={handlePasswordRecovery} // Ejecuta la función de redirección al hacer clic
                        className="link-button"
                    >
                        ¿Olvidó su contraseña?
                    </button>
                </p>
            </div>

    );
};

export default Login;