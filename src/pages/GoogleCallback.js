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
      console.log('Iniciando proceso de Google Callback...');
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const permissionsParam = urlParams.get('permissions');
      const rolesParam = urlParams.get('roles');

      // Validación temprana del token
     

      let permissions = [];
      let roles = [];

      try {
        permissions = permissionsParam ? JSON.parse(permissionsParam) : [];
        roles = rolesParam ? JSON.parse(rolesParam) : [];
        console.log('Permisos procesados:', permissions);
        console.log('Roles procesados:', roles);
      } catch (error) {
        console.error('Error al procesar los permisos o roles:', error);
        toast.error('Error al procesar los permisos o roles.');
        navigate('/login');
        return;
      }

      try {
        let combinedPermissions = [...permissions];

        // Obtener permisos asociados a cada rol
        for (const role of roles) {
          console.log(`Obteniendo permisos para el rol: ${role.name}`);
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
            console.log(`Permisos obtenidos para el rol ${role.name}:`, rolePermissions);
          } else {
            console.warn(`No se pudieron obtener permisos para el rol: ${role.name}`);
          }
        }

        // Establecer los permisos combinados en el contexto
        console.log('Permisos combinados finales:', combinedPermissions);
        setPermissions(combinedPermissions);
        login(roles, token, 'Usuario Google');
        toast.success('Autenticado exitosamente con Google.');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
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