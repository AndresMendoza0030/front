// src/components/UserPermissions.js
import React, { useState, useEffect } from 'react';
import './UserPermissions.css';
import UserModal from './UserModal';
import { useAuth } from '../context/AuthContext';

const UserPermissions = ({ users, fetchUsers }) => {
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { token } = useAuth();

    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    useEffect(() => {
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
                    // Accedemos a data.data.permissions
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
                    // Accedemos a data.data.roles
                    setRoles(Array.isArray(data.data.roles) ? data.data.roles : []);
                } else {
                    console.error('Error al obtener roles:', data.message);
                }
            } catch (error) {
                console.error('Error al obtener roles:', error.message);
            }
        };

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

    // Calcular los usuarios a mostrar en la página actual
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = Array.isArray(users) ? users.slice(indexOfFirstUser, indexOfLastUser) : [];

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="config-container">
            <div className="config-header">
                <h1>Configuración</h1>
            </div>
            <div className="config-form">
                <h2>Gestión de Usuarios</h2>
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
                                <td>
                                    <button className="edit-button" onClick={() => openModal(user)}>Editar</button>
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
