import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PermissionsProvider } from './context/PermissionsContext';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import PasswordRecovery from './pages/PasswordRecovery';
import Dashboard from './pages/Dashboard';
import BaseLayout from './components/BaseLayout';
import ProtectedRoute from './components/ProtectedRoute';
import UserConfig from './pages/UserConfig';
import GoogleCallback from './pages/GoogleCallback';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PermissionsProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/password-recovery" element={<PasswordRecovery />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <BaseLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/config" element={<UserConfig />} />
                      {/* Agrega más rutas aquí que necesiten el BaseLayout */}
                    </Routes>
                  </BaseLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </PermissionsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;