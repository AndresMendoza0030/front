// src/components/RoleManagement.js

import React, { useState, useEffect } from 'react';
import '../pages/UserPermissions.css'; // Puedes reutilizar los estilos o crear uno nuevo
import RoleModal from '../pages/RoleModal';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { token } = useAuth();
    const { hasPermission } = usePermissions();
    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, [token]);

    const fetchRoles = async () => {
        try {
            const response = await fetch('http://fya-api.com:80/api/roles', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setRoles(Array.isArray(data.data.roles) ? data.data.roles : []);
            } else {
                console.error('Error al obtener roles:', data.message);
            }
        } catch (error) {
            console.error('Error al obtener roles:', error.message);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await fetch('http://fya-api.com:80/api/permissions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (response.ok) {
                setPermissions(Array.isArray(data.data.permissions) ? data.data.permissions : []);
            } else {
                console.error('Error al obtener permisos:', data.message);
            }
        } catch (error) {
            console.error('Error al obtener permisos:', error.message);
        }
    };

    const openModal = (role) => {
        setSelectedRole(role);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedRole(null);
        setShowModal(false);
        fetchRoles();
    };

    return (
        <div className="config-container">
            <div className="config-header">
                <h1>Gestión de Roles</h1>
            </div>
            <div className="config-form">
                <h2>Roles y Permisos Asociados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre del Rol</th>
                            <th>Permisos Asociados</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id}>
                                <td>{role.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                                <td>{role.permissions?.map(permission => permission.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ') || 'Sin permisos'}</td>
                                <td>
                                    <button className="edit-button" onClick={() => openModal(role)}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && selectedRole && (
                <RoleModal
                    role={selectedRole}
                    permissions={permissions}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default RoleManagement;
