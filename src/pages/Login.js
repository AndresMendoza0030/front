import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, googleLogout, useGoogleLogin } from '@react-oauth/google'; // Importamos GoogleOAuthProvider y useGoogleLogin
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const { setPermissions } = usePermissions();
    const navigate = useNavigate();

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
            if (response.ok) {
                const { token, user, permissions, roles } = data.data;
                setPermissions(permissions);
                login(roles, token, user.name);
                navigate('/dashboard');
            } else {
                console.error('Login falló:', data.message);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            alert('Error al iniciar sesión, verifica tus credenciales');
        }
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        try {
            const idToken = tokenResponse.credential;

            const result = await fetch('https://backend-production-5e0d.up.railway.app/auth/google/', {
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
                login(roles, token, user.name);
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
        console.error('Error al iniciar sesión con Google:', error);
        alert('Error al iniciar sesión con Google');
    };

    const handlePasswordRecovery = () => {
        navigate('/password-recovery');
    };

    return (
        <GoogleOAuthProvider clientId="3191715525-54lsdrhbk22k0dk2e6cdrlqk2derqcbj.apps.googleusercontent.com">
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
                <div className="google-login-button">
                    <useGoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onFailure={handleGoogleFailure}
                        useOneTap
                    />
                </div>
                <p>
                    <button onClick={handlePasswordRecovery} className="link-button">
                        ¿Olvidó su contraseña?
                    </button>
                </p>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
