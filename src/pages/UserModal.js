// src/components/UserModal.js

import React, { useState, useEffect } from 'react';
import './UserPermissions.css';
import { useAuth } from '../context/AuthContext';

const UserModal = ({ user, permissions = [], roles = [], closeModal }) => {
    const { token } = useAuth();

    // Aseguramos que 'permissions' y 'roles' son arrays
    permissions = Array.isArray(permissions) ? permissions : [];
    roles = Array.isArray(roles) ? roles : [];

    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        // Actualiza el estado si el usuario cambia
        setSelectedPermissions(user.permissions?.map(permission => permission.id) || []);
        setSelectedRoles(user.roles?.map(role => role.id) || []);
    }, [user]);

    const handlePermissionChange = (permissionId) => {
        if (selectedPermissions.includes(permissionId)) {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
        } else {
            setSelectedPermissions([...selectedPermissions, permissionId]);
        }
    };

    const handleRoleChange = (roleId) => {
        roleId = parseInt(roleId);
        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter(id => id !== roleId));
        } else {
            setSelectedRoles([...selectedRoles, roleId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const currentPermissions = user.permissions.map(permission => permission.id);
            const currentRoles = user.roles.map(role => role.id);

            // Permisos para asignar y revocar
            const permissionsToAssign = selectedPermissions.filter(id => !currentPermissions.includes(id));
            const permissionsToRevoke = currentPermissions.filter(id => !selectedPermissions.includes(id));

            // Roles para asignar y revocar
            const rolesToAssign = selectedRoles.filter(id => !currentRoles.includes(id));
            const rolesToRevoke = currentRoles.filter(id => !selectedRoles.includes(id));

            // Asignar permisos
            for (const permissionId of permissionsToAssign) {
                await fetch('https://backend-production-5e0d.up.railway.app/api/assign-permission', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        permission_id: permissionId,
                    }),
                });
            }

            // Revocar permisos
            for (const permissionId of permissionsToRevoke) {
                await fetch('https://backend-production-5e0d.up.railway.app/api/revoke-permission', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        permission_id: permissionId,
                    }),
                });
            }

            // Asignar roles
            for (const roleId of rolesToAssign) {
                await fetch('https://backend-production-5e0d.up.railway.app/api/assign-role-to-user', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        role_id: roleId,
                    }),
                });
            }

            // Revocar roles
            for (const roleId of rolesToRevoke) {
                await fetch('https://backend-production-5e0d.up.railway.app/api/revoke-role-to-user', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        role_id: roleId,
                    }),
                });
            }

            closeModal(); // Cerrar el modal después de actualizar
        } catch (error) {
            console.error('Error al actualizar permisos o roles del usuario:', error.message);
        }
    };

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Actualizar Permisos y Roles de Usuario</h2>
                <form onSubmit={handleSubmit}>
                    {/* Campo de selección de roles */}
                    <div className="form-group">
                        <label className="form-label">Roles:</label>
                        <select
                            multiple
                            value={selectedRoles}
                            onChange={(e) => {
                                const options = e.target.options;
                                const selected = [];
                                for (let i = 0; i < options.length; i++) {
                                    if (options[i].selected) {
                                        selected.push(parseInt(options[i].value));
                                    }
                                }
                                setSelectedRoles(selected);
                            }}
                            className="form-control"
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Lista de permisos */}
                    <div className="form-group">
                        <label className="form-label">Permisos de Sistema:</label>
                        <div className="permissions-list">
                            {permissions.map((permission) => (
                                <div key={permission.id} className="permission-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(permission.id)}
                                            onChange={() => handlePermissionChange(permission.id)}
                                        />
                                        {permission.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="submit-button">Actualizar</button>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
