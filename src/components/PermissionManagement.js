import React, { useState, useEffect } from 'react';
import '../pages/UserPermissions.css';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';

const PermissionManagement = () => {
    const [permissions, setPermissions] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPermissionName, setNewPermissionName] = useState('');
    const { token } = useAuth();

    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [permissionsPerPage] = useState(10);

    useEffect(() => {
        fetchPermissions();
    }, [token]);

    const fetchPermissions = async () => {
        const toastId = 'fetch-permissions';
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/permissions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log("Permissions received from server:", data);

            if (response.ok) {
                setPermissions(Array.isArray(data.data.permissions) ? data.data.permissions : []);
                /*if (!toast.isActive(toastId)) {
                    toast.success('Permisos obtenidos correctamente', { toastId, containerId: 'my-toast-container' });
                }*/
            } else {
                console.error('Error al obtener permisos:', data.message);
                if (!toast.isActive(toastId)) {
                    toast.error(`Error al obtener permisos: ${data.message}`, { toastId, containerId: 'my-toast-container' });
                }
            }
        } catch (error) {
            console.error('Error al obtener permisos:', error.message);
            if (!toast.isActive(toastId)) {
                toast.error(`Error al obtener permisos: ${error.message}`, { toastId, containerId: 'my-toast-container' });
            }
        }
    };

    const handleCreatePermission = async (e) => {
        e.preventDefault();
        const toastId = 'create-permission';
        if (newPermissionName.trim() !== '') {
            try {
                const response = await fetch('https://backend-production-5e0d.up.railway.app/api/permissions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newPermissionName }),
                });

                if (response.ok) {
                    if (!toast.isActive(toastId)) {
                        toast.success('Permiso creado exitosamente', { toastId, containerId: 'my-toast-container' });
                    }
                    setNewPermissionName('');
                    setShowCreateModal(false);
                    fetchPermissions();
                } else {
                    const errorText = await response.text();
                    console.error('Error al crear permiso:', errorText);
                    if (!toast.isActive(toastId)) {
                        toast.error(`Error al crear permiso: ${errorText}`, { toastId, containerId: 'my-toast-container' });
                    }
                }
            } catch (error) {
                console.error('Error al crear permiso:', error.message);
                if (!toast.isActive(toastId)) {
                    toast.error(`Error al crear permiso: ${error.message}`, { toastId, containerId: 'my-toast-container' });
                }
            }
        } else {
            if (!toast.isActive(toastId)) {
                toast.error('El nombre del permiso no puede estar vacío', { toastId, containerId: 'my-toast-container' });
            }
        }
    };

    const handleDeletePermission = async (permissionId) => {
        const toastId = `delete-permission-${permissionId}`;
        toast.info(
            ({ closeToast }) => (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold' }}>¿Está seguro de que desea eliminar este permiso?</p>
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
                                    const response = await fetch('https://backend-production-5e0d.up.railway.app/api/permissions', {
                                        method: 'DELETE',
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ id: permissionId }),
                                    });

                                    if (response.ok) {
                                        if (!toast.isActive(toastId)) {
                                            toast.success('Permiso eliminado exitosamente', { toastId, containerId: 'my-toast-container' });
                                        }
                                        fetchPermissions();
                                    } else {
                                        const errorText = await response.text();
                                        console.error('Error al eliminar permiso:', errorText);
                                        if (!toast.isActive(toastId)) {
                                            toast.error(`Error al eliminar permiso: ${errorText}`, { toastId, containerId: 'my-toast-container' });
                                        }
                                    }
                                } catch (error) {
                                    console.error('Error al eliminar permiso:', error.message);
                                    if (!toast.isActive(toastId)) {
                                        toast.error(`Error al eliminar permiso: ${error.message}`, { toastId, containerId: 'my-toast-container' });
                                    }
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
            }
        );
    };

    // Calcular los permisos a mostrar en la página actual
    const indexOfLastPermission = currentPage * permissionsPerPage;
    const indexOfFirstPermission = indexOfLastPermission - permissionsPerPage;
    const currentPermissions = Array.isArray(permissions) ? permissions.slice(indexOfFirstPermission, indexOfLastPermission) : [];

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="config-container">
            <ToastContainer containerId="my-toast-container" />
            <div className="config-header">
                <h1>Gestión de Permisos</h1>
            </div>
            <div className="config-form">
                <div className="header-container">
                    <h2>Gestión de Permisos</h2>
                    <button className="add-button" onClick={() => setShowCreateModal(true)}>
                        <FaPlus />
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPermissions.map((permission, index) => (
                            <tr key={index}>
                                <td>{permission.id}</td>
                                <td>{permission.name}</td>
                                <td className="actions-cell">
                                    <div className="buttons-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                        <button className="edit-button" onClick={() => console.log(`Editar permiso ${permission.id}`)}>
                                            <FaPencilAlt />
                                        </button>
                                        <button className="pagination-button" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDeletePermission(permission.id)}>
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Paginación */}
                <div className="pagination">
                    {[...Array(Math.ceil(permissions.length / permissionsPerPage)).keys()].map(number => (
                        <button key={number} onClick={() => paginate(number + 1)} className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}>
                            {number + 1}
                        </button>
                    ))}
                </div>
            </div>
            {showCreateModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Crear Nuevo Permiso</h2>
                        <form onSubmit={handleCreatePermission}>
                            <input
                                type="text"
                                value={newPermissionName}
                                onChange={(e) => setNewPermissionName(e.target.value)}
                                placeholder="Nombre del nuevo permiso"
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

export default PermissionManagement;