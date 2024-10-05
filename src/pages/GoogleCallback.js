import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setPermissions } = usePermissions();

  useEffect(() => {
    const processGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const permissionsParam = urlParams.get('permissions');
      const rolesParam = urlParams.get('roles');

      // Validación temprana del token
      if (!token) {
        toast.error('Token no encontrado en la URL');
        navigate('/login');
        return;
      }

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

      // Imprimir los parámetros extraídos en la consola para depuración
      console.log('Token:', token);
      console.log('Permissions:', permissions);
      console.log('Roles:', roles);

      try {
        let combinedPermissions = [...permissions];

        // Obtener permisos asociados a cada rol
        for (const role of roles) {
          const roleResponse = await fetch(
            `https://backend-production-5e0d.up.railway.app/api/roles?name=${role.name}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

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

        // Establecer los permisos combinados en el contexto
        setPermissions(combinedPermissions);
        login(roles, token, 'Usuario Google');
        toast.success('Autenticado exitosamente con Google.');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Error al iniciar sesión con Google: ' + error.message);
        navigate('/login');
      }
    };

    processGoogleCallback();
  }, [navigate, login, setPermissions]);

  return (
    <div>
      <h2>Procesando inicio de sesión con Google...</h2>
    </div>
  );
};

export default GoogleCallback;
