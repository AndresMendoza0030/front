import React, { useState, useEffect } from 'react';
import '../pages/UserPermissions.css';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const PermissionModal = ({ permission, closeModal, fetchPermissions }) => {
    const { token } = useAuth();
    const [permissionName, setPermissionName] = useState(permission ? permission.name : '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = 'my-toast-container';
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/permission', {
                method: permission ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: permission?.id,
                    name: permissionName,
                }),
            });

            if (response.ok) {
                if (!toast.isActive(toastId)) {
                    toast.success(permission ? 'Permiso actualizado exitosamente' : 'Permiso creado exitosamente', { toastId, containerId: 'my-toast-container' });
                }
                setPermissionName('');
                closeModal();
                fetchPermissions();
            } else {
                const errorText = await response.text();
                console.error('Error al crear/actualizar permiso:', errorText);
                if (!toast.isActive(toastId)) {
                    toast.error(`Error al crear/actualizar permiso: ${errorText}`, { toastId, containerId: 'my-toast-container' });
                }
            }
        } catch (error) {
            console.error('Error al crear/actualizar permiso:', error.message);
            if (!toast.isActive(toastId)) {
                toast.error(`Error al crear/actualizar permiso: ${error.message}`, { toastId, containerId: 'my-toast-container' });
            }
        }
    };

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content login-container">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>{permission ? 'Editar Permiso' : 'Crear Nuevo Permiso'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Nombre del permiso */}
                    <div className="form-group">
                        <label className="form-label">Nombre del Permiso:</label>
                        <input
                            type="text"
                            value={permissionName}
                            onChange={(e) => setPermissionName(e.target.value)}
                            className="form-control"
                            placeholder="Nombre del permiso"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">{permission ? 'Guardar Cambios' : 'Crear'}</button>
                   
                </form>
            </div>
        </div>
    );
};

export default PermissionModal;