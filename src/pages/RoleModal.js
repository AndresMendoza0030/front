import React, { useState, useEffect } from 'react';
import './Login.css'; // Reutilizando los estilos del Login
import { useAuth } from '../context/AuthContext';

const RoleModal = ({ role, permissions = [], closeModal }) => {
    const { token } = useAuth();

    permissions = Array.isArray(permissions) ? permissions : [];

    const [roleName, setRoleName] = useState(role.name);
    // Asegúrate de inicializar los permisos seleccionados basados en el role inicialmente.
    const [selectedPermissions, setSelectedPermissions] = useState(role.permissions ? role.permissions.map(permission => permission.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())) : []);

    useEffect(() => {
        if (role && role.permissions) {
            setRoleName(role.name);
            setSelectedPermissions(role.permissions.map(permission => permission.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())));
        }
    }, [role]);

    const handlePermissionChange = (permissionName) => {
        if (selectedPermissions.includes(permissionName)) {
            setSelectedPermissions(selectedPermissions.filter(name => name !== permissionName));
        } else {
            setSelectedPermissions([...selectedPermissions, permissionName]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const currentPermissions = role.permissions.map(permission => permission.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

            const permissionsToAssign = selectedPermissions.filter(name => !currentPermissions.includes(name));
            const permissionsToRevoke = currentPermissions.filter(name => !selectedPermissions.includes(name));

            // Asignar permisos al rol
            for (const permissionName of permissionsToAssign) {
                const permission = permissions.find(p => p.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) === permissionName);
                if (permission) {
                    await fetch('https://backend-production-5e0d.up.railway.app/api/assign-permission-role', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            role_id: role.id,
                            permission_id: permission.id,
                        }),
                    });
                }
            }

            // Revocar permisos al rol
            for (const permissionName of permissionsToRevoke) {
                const permission = permissions.find(p => p.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) === permissionName);
                if (permission) {
                    await fetch('https://backend-production-5e0d.up.railway.app/api/revoke-permission-role', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            role_id: role.id,
                            permission_id: permission.id,
                        }),
                    });
                }
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
            <div className="modal-content login-container">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Editar Rol</h2>
                <form onSubmit={handleSubmit} className="">
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
                                <div key={permission.id} className="permission-item" style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(permission.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))}
                                        onChange={() => handlePermissionChange(permission.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))}
                                        style={{ marginLeft: '-20px', marginRight: '10px', width: '20px' }}
                                    />
                                    <label style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '200px' }}>
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