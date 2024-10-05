// src/components/UserPermissions.js

import React, { useState, useEffect } from 'react';
import './UserPermissions.css';
import UserModal from './UserModal';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';

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

    useEffect(() => {
        fetchPermissions();
        fetchRoles();
    }, [token]);

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
            console.log("Permissions received from server:", data);

            if (response.ok) {
                setPermissions(Array.isArray(data.data.permissions) ? data.data.permissions : []);
            } else {
                console.error('Error al obtener permisos:', data.message);
            }
        } catch (error) {
            console.error('Error al obtener permisos:', error.message);
        }
    };

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
            console.log("Roles received from server:", data);

            if (response.ok) {
                setRoles(Array.isArray(data.data.roles) ? data.data.roles : []);
            } else {
                console.error('Error al obtener roles:', data.message);
            }
        } catch (error) {
            console.error('Error al obtener roles:', error.message);
        }
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setShowModal(false);
        fetchUsers();
    };

    const handleCreatePermission = async (e) => {
        e.preventDefault();
        if (newPermissionName.trim() !== '') {
            await createPermission(newPermissionName);
            setNewPermissionName('');
            setShowCreateModal(false);
            fetchPermissions();
        }
    };

    const handleDeactivateUser = async (userId) => {
        if (window.confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
            try {
                const response = await fetch('https://backend-production-5e0d.up.railway.app/api/user', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: userId }),
                });

                if (response.ok) {
                    console.log('Usuario desactivado exitosamente');
                    fetchUsers();
                } else {
                    const errorText = await response.text();
                    console.error('Error al desactivar usuario:', errorText);
                }
            } catch (error) {
                console.error('Error al desactivar usuario:', error.message);
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

export default UserPermissions;
