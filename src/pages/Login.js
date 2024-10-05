import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
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
            console.log('Datos recibidos del servidor:', data);

            if (response.ok) {
                const { token, user, permissions, roles } = data.data;
                let combinedPermissions = [...permissions]; // Comienza con los permisos específicos del usuario

                // Iterar sobre los roles y obtener los permisos asociados usando el filtro
                for (const role of roles) {
                    const roleResponse = await fetch(`https://backend-production-5e0d.up.railway.app/api/roles?name=${role.name}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const roleData = await roleResponse.json();
                    if (roleResponse.ok && roleData.data && roleData.data.roles.length > 0) {
                        const rolePermissions = roleData.data.roles[0].permissions;
                        combinedPermissions = [
                            ...combinedPermissions,
                            ...rolePermissions.filter(
                                (p) => !combinedPermissions.some((cp) => cp.id === p.id)
                            ),
                        ];
                    }
                }

                // Establecer los permisos combinados
                setPermissions(combinedPermissions);
                login(roles, token, user.name, user.email); // Añadido email al login
                navigate('/dashboard');
            } else {
                console.error('Login falló con mensaje:', data.message);
            }

        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            alert('Error al iniciar sesión, verifica tus credenciales');
        }
    };

    const handlePasswordRecovery = () => {
        navigate('/password-recovery');
    };

    const handleGoogleLogin = () => {
        window.location.href = 'https://backend-production-5e0d.up.railway.app/auth/google/';
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
                <button onClick={handleGoogleLogin} className="google-login-button">
                    Iniciar sesión con Google
                </button>
                <p>
                    <button
                        onClick={handlePasswordRecovery}
                        className="link-button"
                    >
                        ¿Olvidó su contraseña?
                    </button>
                </p>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
