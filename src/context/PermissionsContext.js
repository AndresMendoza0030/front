// src/context/PermissionsContext.js
import React, { createContext, useContext, useState } from 'react';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);

    const hasPermission = (permissionName) => {
        return permissions.some(permission => permission.name === permissionName);
    };

    return (
        <PermissionsContext.Provider value={{ permissions, setPermissions, hasPermission }}>
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => {
    return useContext(PermissionsContext);
};
