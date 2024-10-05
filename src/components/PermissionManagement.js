// src/components/PermissionManagement.js

import React, { useState, useEffect } from 'react';
import '../pages/UserPermissions.css';
import { useAuth } from '../context/AuthContext';
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

    const handleCreatePermission = async (e) => {
        e.preventDefault();
        if (newPermissionName.trim() !== '') {
            // Lógica para crear el permiso
            setNewPermissionName('');
            setShowCreateModal(false);
            fetchPermissions();
        }
    };

    const handleDeletePermission = async (permissionId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este permiso?')) {
            try {
                const response = await fetch(`https://backend-production-5e0d.up.railway.app/api/permissions/${permissionId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log('Permiso eliminado exitosamente');
                    fetchPermissions();
                } else {
                    const errorText = await response.text();
                    console.error('Error al eliminar permiso:', errorText);
                }
            } catch (error) {
                console.error('Error al eliminar permiso:', error.message);
            }
        }
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