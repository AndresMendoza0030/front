import React, { useState } from 'react';
import './Login.css'; // Reutilizando los estilos del Login
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUserModal = ({ closeModal }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = 'create-user-toast';

    try {
      const response = await fetch('https://backend-production-5e0d.up.railway.app/api/user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Usuario creado exitosamente', { toastId });
        // Trigger password recovery email
        await fetch('https://backend-production-5e0d.up.railway.app/api/password-recovery', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });
        closeModal();
      } else {
        const errorText = await response.text();
        throw new Error(`Error al crear usuario: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast.error(`Error al crear usuario: ${error.message}`, { toastId });
    }
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <ToastContainer />
      <div className="modal-content login-container">
        <span className="close back-button" onClick={closeModal} style={{ fontSize: '20px' }}>&times;</span>
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} className="">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="lastname">Apellido:</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="submit-button">Crear Usuario</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;