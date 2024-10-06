import React, { useState, useEffect } from 'react';
import '../pages/UserPermissions.css'; // Puedes reutilizar los estilos o crear uno nuevo
import RoleModal from '../pages/RoleModal';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';

const RoleManagement = ({ createRole, deleteRole }) => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { token } = useAuth();
    const [newRoleName, setNewRoleName] = useState('');

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, [token]);

    const fetchRoles = async () => {
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/roles', {
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
                toast.error(`Error al obtener roles: ${data.message}`, { containerId: 'my-toast-container' });
            }
        } catch (error) {
            console.error('Error al obtener roles:', error.message);
            toast.error(`Error al obtener roles: ${error.message}`, { containerId: 'my-toast-container' });
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/permissions', {
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
                toast.error(`Error al obtener permisos: ${data.message}`, { containerId: 'my-toast-container' });
            }
        } catch (error) {
            console.error('Error al obtener permisos:', error.message);
            toast.error(`Error al obtener permisos: ${error.message}`, { containerId: 'my-toast-container' });
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

    const handleCreateRole = async (e) => {
        e.preventDefault();
        const toastId = 'my-toast-container';
        if (newRoleName.trim() !== '') {
            try {
                await createRole(newRoleName);
                setNewRoleName('');
                setShowCreateModal(false);
                fetchRoles();
                toast.success('Rol creado exitosamente', { toastId, containerId: 'my-toast-container' });
            } catch (error) {
                console.error('Error al crear rol:', error.message);
                toast.error(`Error al crear rol: ${error.message}`, { toastId, containerId: 'my-toast-container' });
            }
        } else {
            toast.error('El nombre del rol no puede estar vacío', { toastId, containerId: 'my-toast-container' });
        }
    };

    const handleDeleteRole = async (roleId) => {
        const toastId = 'my-toast-container';
        toast.info(
            ({ closeToast }) => (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold' }}>¿Está seguro de que desea eliminar este rol?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                        <button
                            style={{
                                padding: '8px 12px',
                                borderRadius: '5px',
                                backgroundColor: '#d9534f',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                            onClick={async () => {
                                try {
                                    await deleteRole(roleId);
                                    fetchRoles();
                                    toast.success('Rol eliminado exitosamente', { containerId: 'my-toast-container' });
                                } catch (error) {
                                    console.error('Error al eliminar rol:', error.message);
                                    toast.error(`Error al eliminar rol: ${error.message}`, { containerId: 'my-toast-container' });
                                }
                                closeToast();
                            }}
                        >
                            Sí, eliminar
                        </button>
                        <button
                            style={{
                                padding: '8px 12px',
                                borderRadius: '5px',
                                backgroundColor: '#5bc0de',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                            onClick={closeToast}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
                draggable: false,
                containerId: 'my-toast-container',
                toastId,
            }
        );
    };

    return (
        <div className="config-container">
      
            <div className="config-header">
                <h1>Roles y Permisos Asociados</h1>
            </div>
            <div className="config-form">
                <div className="header-container">
                    <h2>Roles y Permisos Asociados</h2>
                    <button className="add-button" onClick={() => setShowCreateModal(true)}>
                        <FaPlus />
                    </button>
                </div>
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
                                    <button className="edit-button" onClick={() => openModal(role)}><FaPencilAlt /></button>
                                    <button className="pagination-button" onClick={() => handleDeleteRole(role.id)}><FaTrashAlt/></button>
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
            {showCreateModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Crear Nuevo Rol</h2>
                        <form onSubmit={handleCreateRole}>
                            <input
                                type="text"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                placeholder="Nombre del nuevo rol"
                                required
                            />
                            <button type="submit">Crear</button>
                            <button type="button" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;