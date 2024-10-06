import React, { useState, useEffect } from 'react';
import '../pages/UserPermissions.css';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import PermissionModal from '../pages/PermissionModal';

const PermissionManagement = () => {
    const [permissions, setPermissions] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [permissionToEdit, setPermissionToEdit] = useState(null);
    const { token } = useAuth();

    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [permissionsPerPage] = useState(10);

    useEffect(() => {
        fetchPermissions();
    }, [token]);

    const fetchPermissions = async () => {
        const toastId = 'my-toast-container';
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

    const handleEditPermission = (permission) => {
        setPermissionToEdit(permission);
    };

    const handleCreatePermission = () => {
        setPermissionToEdit(null);
        setShowCreateModal(true);
    };

    const handleDeletePermission = async (permissionId) => {
        const toastId = 'my-toast-container';
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
                                    const response = await fetch('https://backend-production-5e0d.up.railway.app/api/permission', {
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
                toastId,
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
           
            <div className="config-header">
                <h1>Gestión de Permisos</h1>
            </div>
            <div className="config-form">
                <div className="header-container">
                    <h2>Gestión de Permisos</h2>
                    <button className="add-button" onClick={handleCreatePermission}>
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
                                        <button className="edit-button" onClick={() => handleEditPermission(permission)}>
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
            {(showCreateModal || permissionToEdit) && (
                <PermissionModal
                    permission={permissionToEdit}
                    closeModal={() => {
                        setPermissionToEdit(null);
                        setShowCreateModal(false);
                    }}
                    fetchPermissions={fetchPermissions}
                />
            )}
        </div>
    );
};

export default PermissionManagement;