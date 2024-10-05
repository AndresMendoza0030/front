import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const permissionsParam = urlParams.get('permissions');
    const rolesParam = urlParams.get('roles');

    let permissions = [];
    let roles = [];

    try {
      permissions = permissionsParam ? JSON.parse(permissionsParam) : [];
      roles = rolesParam ? JSON.parse(rolesParam) : [];
    } catch (error) {
      toast.error('Error al procesar los permisos o roles.');
      navigate('/login');
      return;
    }

    // Imprimir los parámetros extraídos en la consola
    console.log('Token:', token);
    console.log('Permissions:', permissions);
    console.log('Roles:', roles);

    if (token) {
      try {
        login(roles, token, 'Usuario Google');
        toast.success('Autenticado exitosamente con Google.');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Error al iniciar sesión con Google: ' + error.message);
        navigate('/login');
      }
    } else {
      toast.error('Token no encontrado en la URL');
      navigate('/login');
    }
  }, [navigate, login]);

  return (
    <div>
      <h2>Procesando inicio de sesión con Google...</h2>
    </div>
  );
};

export default GoogleCallback;
