// src/components/RoleModal.js

import React, { useState, useEffect } from 'react';
import './UserPermissions.css'; // Puedes reutilizar los estilos o crear uno nuevo
import { useAuth } from '../context/AuthContext';

const RoleModal = ({ role, permissions = [], closeModal }) => {
    const { token } = useAuth();

    permissions = Array.isArray(permissions) ? permissions : [];

    const [roleName, setRoleName] = useState(role.name);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        setSelectedPermissions(role.permissions?.map(permission => permission.id) || []);
    }, [role]);

    const handlePermissionChange = (permissionId) => {
        if (selectedPermissions.includes(permissionId)) {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
        } else {
            setSelectedPermissions([...selectedPermissions, permissionId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const currentPermissions = role.permissions.map(permission => permission.id);

            const permissionsToAssign = selectedPermissions.filter(id => !currentPermissions.includes(id));
            const permissionsToRevoke = currentPermissions.filter(id => !selectedPermissions.includes(id));

            // Asignar permisos al rol
            for (const permissionId of permissionsToAssign) {
                await fetch('https://backend-production-5e0d.up.railway.app/api/assign-permission-role', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        role_id: role.id,
                        permission_id: permissionId,
                    }),
                });
            }

            // Revocar permisos al rol
            for (const permissionId of permissionsToRevoke) {
                await fetch('https://backend-production-5e0d.up.railway.app/api/revoke-permission-role', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        role_id: role.id,
                        permission_id: permissionId,
                    }),
                });
            }

            // Actualizar el nombre del rol si ha cambiado
            if (roleName !== role.name) {
                await fetch('https://backend-production-5e0d.up.railway.app/api/role', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: role.id,
                        name: roleName,
                    }),
                });
            }

            closeModal();
        } catch (error) {
            console.error('Error al actualizar el rol:', error.message);
        }
    };

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Editar </h2>
                <form onSubmit={handleSubmit}>
                    {/* Nombre del rol */}
                    <div className="form-group">
                        <label className="form-label">Nombre del Rol:</label>
                        <input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    {/* Lista de permisos */}
                    <div className="form-group">
                        <label className="form-label">Permisos Asociados:</label>
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
                    <button type="submit" className="submit-button">Guardar Cambios</button>
                </form>
            </div>
        </div>
    );
};

export default RoleModal;
