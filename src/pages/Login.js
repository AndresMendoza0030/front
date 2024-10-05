import React, { useState, useEffect } from 'react';
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

    const handleGoogleLogin = () => {
        window.location.href = 'https://backend-production-5e0d.up.railway.app/auth/google/';
    };

    const handlePasswordRecovery = () => {
        navigate('/password-recovery');
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
            <button onClick={handleGoogleLogin} className="google-login-button">
                <div className="google-icon-wrapper">
                    <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google Icon" />
                </div>
                <span className="button-text">Iniciar sesión con Google</span>
            </button>
            <p>
                <button onClick={handlePasswordRecovery} className="link-button">
                    ¿Olvidó su contraseña?
                </button>
            </p>
        </div>
    );
};

export default Login;
