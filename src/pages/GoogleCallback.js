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
    let isMounted = true; // Para asegurarse de que el proceso solo se ejecute una vez

    const processGoogleCallback = async () => {
      console.log('Iniciando proceso de Google Callback...');
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const permissionsParam = urlParams.get('permissions');
      const rolesParam = urlParams.get('roles');
      const email = urlParams.get('email');

      console.log('Email extraído de la URL:', email);

      let permissions = [];
      let roles = [];
      let username = 'Usuario Google';

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
        // Obtener el nombre de usuario a partir del email
        const userResponse = await fetch(
          `https://backend-production-5e0d.up.railway.app/api/users?email=${email}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const userData = await userResponse.json();
        if (userResponse.ok && userData.data && userData.data.users.length > 0) {
          username = userData.data.users[0].name;
          console.log('Nombre de usuario obtenido:', username);
        } else {
          console.warn('No se pudo obtener el nombre de usuario a partir del email proporcionado.');
        }

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
        if (isMounted) {
          setPermissions(combinedPermissions);
          login(roles, token, username, email);
          toast.success('Autenticado exitosamente con Google.');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
        toast.error('Error al iniciar sesión con Google: ' + error.message);
        navigate('/login');
      }
    };

    processGoogleCallback();

    return () => {
      isMounted = false; // Limpiar para asegurarse de que el proceso solo se ejecute una vez
    };
  }, [navigate, login, setPermissions]);

  return (
    <div>
      <h2>Procesando inicio de sesión con Google...</h2>
    </div>
  );
};

export default GoogleCallback;