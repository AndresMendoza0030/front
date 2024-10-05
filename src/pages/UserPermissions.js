import React, { useState, useEffect } from 'react';
import './UserPermissions.css';
import UserModal from './UserModal';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.minimal.css'; // Opcional, para un diseño más limpio

const UserPermissions = ({ users, fetchUsers, createPermission, deletePermission }) => {
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { token } = useAuth();
    const [newPermissionName, setNewPermissionName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);


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
               /* if (!toast.isActive(toastId)) {
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

    const fetchRoles = async () => {
        const toastId = 'fetch-roles';
        try {
            const response = await fetch('https://backend-production-5e0d.up.railway.app/api/roles', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log("Roles received from server:", data);

            if (response.ok) {
                setRoles(Array.isArray(data.data.roles) ? data.data.roles : []);
                /*if (!toast.isActive(toastId)) {
                    toast.success('Roles obtenidos correctamente', { toastId, containerId: 'my-toast-container' });
                }*/
            } else {
                console.error('Error al obtener roles:', data.message);
                if (!toast.isActive(toastId)) {
                    toast.error(`Error al obtener roles: ${data.message}`, { toastId, containerId: 'my-toast-container' });
                }
            }
        } catch (error) {
            console.error('Error al obtener roles:', error.message);
            if (!toast.isActive(toastId)) {
                toast.error(`Error al obtener roles: ${error.message}`, { toastId, containerId: 'my-toast-container' });
            }
        }
    };

    useEffect(() => {
        fetchPermissions();
        fetchRoles();
    }, [token]);
    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setShowModal(false);
        fetchUsers();
    };

    const handleDeactivateUser = (userId) => {
        const toastId = `deactivate-user-${userId}`;
        toast.warn(
            ({ closeToast }) => (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold' }}>¿Está seguro de que desea desactivar este usuario?</p>
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
                            onClick={() => {
                                confirmDeactivateUser(userId);
                                closeToast();
                            }}
                        >
                            Sí, Desactivar
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
                autoClose: false, // No cerrar automáticamente para permitir interacción
                closeOnClick: false,
                closeButton: false,
                draggable: false,
                containerId: 'my-toast-container',
            }
        );
    };

    const confirmDeactivateUser = async (userId) => {
        const toastId = `confirm-deactivate-user-${userId}`;
        try {
            const response = await fetch(`https://backend-production-5e0d.up.railway.app/api/deactivate-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId }),
            });

            if (response.ok) {
                console.log('Usuario desactivado exitosamente');
                if (!toast.isActive(toastId)) {
                    toast.success('Usuario desactivado exitosamente', { toastId, containerId: 'my-toast-container' });
                }
                fetchUsers(); // Actualizar la lista de usuarios
            } else {
                const errorText = await response.text();
                console.error('Error al desactivar usuario:', errorText);
                if (!toast.isActive(toastId)) {
                    toast.error(`Error al desactivar usuario: ${errorText}`, { toastId, containerId: 'my-toast-container' });
                }
            }
        } catch (error) {
            console.error('Error al desactivar usuario:', error.message);
            if (!toast.isActive(toastId)) {
                toast.error(`Error al desactivar usuario: ${error.message}`, { toastId, containerId: 'my-toast-container' });
            }
        }
    };

    // Calcular los usuarios a mostrar en la página actual
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = Array.isArray(users) ? users.slice(indexOfFirstUser, indexOfLastUser) : [];

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="config-container">
            <ToastContainer containerId="my-toast-container" />
            <div className="config-header">
                <h1>Gestión de Usuarios</h1>
            </div>
            <div className="config-form">
                <div className="header-container">
                    <h2>Gestión de Usuarios</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre Completo</th>
                            <th>Correo Electrónico</th>
                            <th>Estado</th>
                            <th>Rol</th>
                            <th>Permisos Asignados</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name} {user.lastname}</td>
                                <td>{user.email}</td>
                                <td>{user.status}</td>
                                <td>{user.roles?.map(role => role.name).join(', ') || 'Sin rol'}</td>
                                <td>{user.permissions?.map(permission => permission.name).join(', ') || 'Sin permisos'}</td>
                                <td className="actions-cell">
                                    <div className="buttons-container">
                                        <button className="edit-button" onClick={() => openModal(user)}>
                                            <FaPencilAlt />
                                        </button>
                                        <button className="pagination-button" onClick={() => handleDeactivateUser(user.id)}>
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
                    {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(number => (
                        <button key={number} onClick={() => paginate(number + 1)} className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}>
                            {number + 1}
                        </button>
                    ))}
                </div>
            </div>
            {showModal && selectedUser && (
                <UserModal
                    user={selectedUser}
                    roles={roles}
                    permissions={permissions}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default UserPermissions;