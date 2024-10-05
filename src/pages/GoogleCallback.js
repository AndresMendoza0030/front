import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store token in your authentication context or state management
      loginWithToken(token)
        .then(() => {
          toast.success('Autenticado exitosamente con Google.');
          navigate('/dashboard'); // Redirige al dashboard después del login
        })
        .catch((error) => {
          toast.error('Error al iniciar sesión con Google: ' + error.message);
          navigate('/login');
        });
    } else {
      toast.error('Token no encontrado en la URL');
      navigate('/login');
    }
  }, [navigate, loginWithToken]);

  return (
    <div>
      <h2>Procesando inicio de sesión con Google...</h2>
    </div>
  );
};

export default GoogleCallback;