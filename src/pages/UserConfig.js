// src/pages/UserConfig.js

import React, { useState, useEffect } from 'react';
import UserPermissions from './UserPermissions'; // Componente para manejar permisos
import RoleManagement from '../components/RoleManagement'; // Importamos el componente de gestión de roles
import ConfigForm from '../components/ConfigForm';
import { usePermissions } from '../context/PermissionsContext'; // Para verificar permisos
import './UserPermissions.css'; // Importa tu archivo CSS
import { useAuth } from '../context/AuthContext';
import PermissionManagement from '../components/PermissionManagement'; // Importamos el componente de gestión de permisos


const UserConfig = () => {
    const [users, setUsers] = useState([]); // Estado para almacenar usuarios
    const { hasPermission } = usePermissions(); // Verifica si el usuario tiene permisos necesarios
    const { token, roles } = useAuth(); // Obtenemos el token y roles del contexto de autenticación

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error de respuesta del servidor:", errorText);
                throw new Error('Error al obtener usuarios');
            }
    
            const data = await response.json();
            console.log("Datos recibidos del servidor:", data);
    
            setUsers(Array.isArray(data.data.users) ? data.data.users : []);
        } catch (error) {
            console.error('Error al obtener usuarios:', error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const createRole = async (roleName) => {
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/roles', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: roleName }),
            });

            if (response.ok) {
                console.log('Rol creado exitosamente');
                fetchUsers(); // Actualizar la lista de usuarios/roles si es necesario
            } else {
                const errorText = await response.text();
                console.error('Error al crear rol:', errorText);
            }
        } catch (error) {
            console.error('Error al crear rol:', error.message);
        }
    };

    const deleteRole = async (roleId) => {
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/roles', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: roleId }),
            });

            if (response.ok) {
                console.log('Rol eliminado exitosamente');
                fetchUsers(); // Actualizar la lista de usuarios/roles si es necesario
            } else {
                const errorText = await response.text();
                console.error('Error al eliminar rol:', errorText);
            }
        } catch (error) {
            console.error('Error al eliminar rol:', error.message);
        }
    };

    const createPermission = async (permissionName) => {
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/permission', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: permissionName }),
            });

            if (response.ok) {
                console.log('Permiso creado exitosamente');
            } else {
                const errorText = await response.text();
                console.error('Error al crear permiso:', errorText);
            }
        } catch (error) {
            console.error('Error al crear permiso:', error.message);
        }
    };

    const deletePermission = async (permissionId) => {
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/permission', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: permissionId }),
            });

            if (response.ok) {
                console.log('Permiso eliminado exitosamente');
            } else {
                const errorText = await response.text();
                console.error('Error al eliminar permiso:', errorText);
            }
        } catch (error) {
            console.error('Error al eliminar permiso:', error.message);
        }
    };

    return (
        <div className="config-container">
            {hasPermission("Guardar Permisos") && (
                <>
                    <UserPermissions users={users} fetchUsers={fetchUsers} />
                    <PermissionManagement /> {/* Añadimos el componente para gestionar permisos */}
                    <RoleManagement
                        createRole={createRole}
                        deleteRole={deleteRole}
                    />
                </>
            )}
            <ConfigForm
                title="Configuración de Respaldo Automático"
                action="/api/backup"
                fields={[
                    { id: 'frecuencia', label: 'Frecuencia de Respaldo (días):', type: 'number', name: 'frecuencia', min: '1', required: true }
                ]}
            />
            <ConfigForm
                title="Eliminar Registros de Auditoría"
                action="/api/delete_audit"
                fields={[
                    { id: 'start_date', label: 'Fecha de Inicio:', type: 'date', name: 'start_date', required: true },
                    { id: 'end_date', label: 'Fecha de Fin:', type: 'date', name: 'end_date', required: true }
                ]}
            />
            <ConfigForm
                title="Eliminar Registros de Respaldo"
                action="/api/delete_backup"
                fields={[
                    { id: 'start_date', label: 'Fecha de Inicio:', type: 'date', name: 'start_date', required: true },
                    { id: 'end_date', label: 'Fecha de Fin:', type: 'date', name: 'end_date', required: true }
                ]}
            />
            {roles.includes('admin') && (
                <ConfigForm
                    title="Gestión de Roles y Permisos"
                    action="/api/create_role_permission"
                    fields={[
                        { id: 'role_name', label: 'Nombre del Rol:', type: 'text', name: 'role_name', required: true },
                        { id: 'permission_name', label: 'Nombre del Permiso:', type: 'text', name: 'permission_name', required: true }
                    ]}
                />
                
            )}
            
        </div>
    );
};

export default UserConfig;