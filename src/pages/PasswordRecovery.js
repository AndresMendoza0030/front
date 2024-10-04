import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reutilizamos el mismo archivo de estilos
import { FaArrowLeft } from 'react-icons/fa';

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Agregar la clase 'login-page' al body al montar el componente
    useEffect(() => {
        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handlePasswordRecovery = async (e) => {
        e.preventDefault();
        console.log('handlePasswordRecovery function called');

        try {
            const requestUrl = 'http://fya-api.com:80/api/password-recovery';
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            };

            console.log('Sending request to:', requestUrl);
            console.log('Request options:', requestOptions);

            const response = await fetch(requestUrl, requestOptions);

            console.log('Response status:', response.status);
            console.log('Response status text:', response.statusText);

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                setMessage(data.message || 'Correo de recuperación enviado.');
                setError('');
                console.log('Success message set:', data.message);
            } else {
                setError(data.message || 'Error al solicitar la recuperación de contraseña.');
                setMessage('');
                console.log('Error message set:', data.message);
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            setError('Error al conectar con el servidor.');
            setMessage('');
        }
    };

    // Función para redirigir al login
    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="login-container">
        <button onClick={handleBackToLogin} className="back-button" aria-label="Volver al Login">
            <FaArrowLeft />
        </button>
            <img src="images/logo.webp" alt="Logo de la Organización" />
            <h1>Recuperación de Contraseña</h1>
            <p>Introduce tu correo electrónico para recibir un enlace de recuperación.</p>
            <form onSubmit={handlePasswordRecovery}>
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="submit-button">
                    Enviar Enlace de Recuperación
                </button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default PasswordRecovery;
