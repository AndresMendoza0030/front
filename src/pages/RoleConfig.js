// src/pages/RolesConfig.js

import React from 'react';
import RoleManagement from '../components/RoleManagement';
import { usePermissions } from '../context/PermissionsContext';

const RolesConfig = () => {
    const { hasPermission } = usePermissions();

    return (
        <div className="config-container">
            {hasPermission("Guardar Permisos") && (
                <RoleManagement />
            )}
        </div>
    );
};

export default RolesConfig;
