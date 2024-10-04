// src/pages/UserConfig.js

import React, { useState, useEffect } from 'react';
import UserPermissions from './UserPermissions'; // Componente para manejar permisos
import RoleManagement from '../components/RoleManagement'; // Importamos el componente de gestión de roles
import ConfigForm from '../components/ConfigForm';
import { usePermissions } from '../context/PermissionsContext'; // Para verificar permisos
import './UserPermissions.css'; // Importa tu archivo CSS
import { useAuth } from '../context/AuthContext';

const UserConfig = () => {
    const [users, setUsers] = useState([]); // Estado para almacenar usuarios
    const { hasPermission } = usePermissions(); // Verifica si el usuario tiene permisos necesarios
    const { token } = useAuth(); // Obtenemos el token del contexto de autenticación

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://fya-api.com:80/api/users', {
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
    
            // Aquí ajustamos para acceder a data.data.users
            setUsers(Array.isArray(data.data.users) ? data.data.users : []); 
        } catch (error) {
            console.error('Error al obtener usuarios:', error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    return (
        <div className="config-container">
            {hasPermission("Guardar Permisos") && (
                <>
                    <UserPermissions users={users} fetchUsers={fetchUsers} />
                    <RoleManagement />
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
        </div>
    );
};

export default UserConfig;
