import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';

const Dashboard = () => {

  const { hasPermission } = usePermissions();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [favoriteDocuments, setFavoriteDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalLink, setModalLink] = useState('');
  const [bulletinBoard, setBulletinBoard] = useState([]);
  const [showBulletinModal, setShowBulletinModal] = useState(false);
  const [bulletinForm, setBulletinForm] = useState({ id: null, titulo: '', imagen: '', fecha_publicacion: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const { username } = useAuth();

  useEffect(() => {
    // Fetch data from backend API
    const fetchBulletinBoard = async () => {
      try {
        console.log('Fetching bulletin board data...');
        const response = await fetch('https://backend-production-5e0d.up.railway.app/api/bulletin-board');
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Bulletin Board:', data);
        setBulletinBoard(data);
      } catch (error) {
        console.error('Error fetching bulletin board:', error);
      }
    };

    fetchBulletinBoard();
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, is_read: 1 } : notification
    ));
    setUnreadNotifications(unreadNotifications.filter(notification => notification.id !== id));
  };

  const showNotificationPopup = () => {
    if (unreadNotifications.length === 0) return;
    const notification = unreadNotifications[0];
    setModalMessage(notification.message);
    setModalLink(`/documents/${notification.filename}`);
    setShowModal(true);
    handleMarkAsRead(notification.id);
  };

  useEffect(() => {
    showNotificationPopup();
  }, [unreadNotifications]);

  const handleBulletinSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', bulletinForm.titulo);
    formData.append('imagen', bulletinForm.imagen);
    formData.append('fecha_publicacion', bulletinForm.fecha_publicacion);
  
    try {
      console.log('Submitting bulletin form...');
      console.log('Form data:', {
        titulo: bulletinForm.titulo,
        imagen: bulletinForm.imagen ? bulletinForm.imagen.name : null,
        fecha_publicacion: bulletinForm.fecha_publicacion
      });
      const response = await fetch(`https://backend-production-5e0d.up.railway.app/api/bulletin-board${isEditMode ? `/${bulletinForm.id}` : ''}`, {
        method: isEditMode ? 'PUT' : 'POST',
        body: formData,
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Bulletin saved:', data);
      if (isEditMode) {
        setBulletinBoard(bulletinBoard.map(item => item.id === data.id ? data : item));
      } else {
        setBulletinBoard([...bulletinBoard, data]);
      }
      setShowBulletinModal(false);
    } catch (error) {
      console.error('Error saving bulletin:', error);
      alert(`Error al guardar el anuncio: ${error.message}`);
    }
  };
  
  const handleBulletinFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setBulletinForm({ ...bulletinForm, imagen: files[0] });
    } else {
      setBulletinForm({ ...bulletinForm, [name]: value });
    }
  };

  const handleEditBulletin = (announcement) => {
    setBulletinForm({ id: announcement.id, titulo: announcement.titulo, imagen: '', fecha_publicacion: announcement.fecha_publicacion });
    setIsEditMode(true);
    setShowBulletinModal(true);
  };

  const handleDeleteBulletin = async (id) => {
    try {
      console.log('Deleting bulletin...', id);
      const response = await fetch(`https://backend-production-5e0d.up.railway.app/api/bulletin-board/${id}`, {
        method: 'DELETE',
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log('Bulletin deleted:', id);
      setBulletinBoard(bulletinBoard.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting bulletin:', error);
      alert(`Error al eliminar el anuncio: ${error.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="bulletin-board">
        <Carousel showArrows={true} autoPlay={true} infiniteLoop={true}>
          {bulletinBoard.map(announcement => (
            <div key={announcement.id}>
              <img src={announcement.imagen} alt={`Aviso ${announcement.id}`} />
              <p className="legend">{announcement.fecha_publicacion}</p>
              {hasPermission('Guardar Banner') && (
                <div className="bulletin-actions">
                  <button onClick={() => handleEditBulletin(announcement)} className="edit-bulletin-button">Actualizar</button>
                  <button onClick={() => handleDeleteBulletin(announcement.id)} className="delete-bulletin-button">Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </Carousel>
        {hasPermission('Guardar Banner') && (
          <button onClick={() => { setShowBulletinModal(true); setIsEditMode(false); }} className="add-bulletin-button">Añadir Anuncio</button>
        )}
      </div>
      <div className="welcome-message">
        <h1>Bienvenid@ al Centro Virtual de Documentación</h1>
        <p>Hola, {username}. Aquí tiene accesos rápidos a las funcionalidades principales.</p>
      </div>
      <div className="card">
        <h2>Documentos Recientes</h2>
        <ul>
          {recentDocuments.map(document => (
            <li key={document.filename}><a href={`/documents/${document.filename}`}>{document.filename}</a></li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h2>Documentos Favoritos</h2>
        <ul>
          {favoriteDocuments.map(document => (
            <li key={document.filename}><a href={`/documents/${document.filename}`}>{document.filename}</a></li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h2>Documentos Compartidos</h2>
        <ul>
          {sharedDocuments.map(document => (
            <li key={document.filename}><a href={`/documents/${document.filename}`}>{document.filename}</a> - Compartido por: {document.shared_by}</li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h2>Notificaciones</h2>
        <ul>
          {notifications.map(notification => (
            <li key={notification.id}>
              {notification.message} -
              <a href={`/documents/${notification.filename}`} className="notification-link">Ver archivo</a> -
              {notification.date}
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h2>Tareas Pendientes</h2>
        <ul>
          {userTasks.map(task => (
            <li key={task.id}>{task.description} - Fecha límite: {task.due_date}</li>
          ))}
        </ul>
        <form method="post" action="/api/add_task">
          <input type="text" name="task_description" placeholder="Nueva tarea" />
          <input type="date" name="task_due_date" />
          <button type="submit" className="submit-button">Añadir</button>
        </form>
      </div>
      <div className="card">
        <h2>Calendario de Actividades</h2>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={userTasks.map(task => ({
            title: task.description,
            start: task.due_date,
          }))}
        />
      </div>
      <div className="card">
        <h2>Comentarios y Retroalimentación</h2>
        <form method="post" encType="multipart/form-data" action="/api/submits_feedback" className="feedback-form">
          <textarea name="feedback" placeholder="Escribe tus comentarios aquí..." required></textarea>
          <div className="form-group">
            <label htmlFor="capture">Subir una captura (opcional):</label>
            <input type="file" name="capture" id="capture" className="form-control" accept="image/*" />
            <button type="submit" className="submit-button">Enviar</button>
          </div>
        </form>
      </div>
      {showModal && (
        <div id="notificationModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <p>{modalMessage}</p>
            <div style={{ textAlign: 'center' }}>
              <a href={modalLink} className="modal-button">Ver Archivo</a>
            </div>
          </div>
        </div>
      )}
      {showBulletinModal && (
        <div id="bulletinModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowBulletinModal(false)}>&times;</span>
            <h2>{isEditMode ? 'Actualizar Anuncio' : 'Añadir Nuevo Anuncio'}</h2>
            <form onSubmit={handleBulletinSubmit}>
              <div className="form-group">
                <label htmlFor="titulo">Título:</label>
                <input type="text" id="titulo" name="titulo" value={bulletinForm.titulo} onChange={handleBulletinFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="imagen">Subir Imagen:</label>
                <input type="file" id="imagen" name="imagen" onChange={handleBulletinFormChange} required={!isEditMode} />
              </div>
              <div className="form-group">
                <label htmlFor="fecha_publicacion">Fecha de Publicación:</label>
                <input type="datetime-local" id="fecha_publicacion" name="fecha_publicacion" value={bulletinForm.fecha_publicacion} onChange={handleBulletinFormChange} required />
              </div>
              <button type="submit" className="submit-button">{isEditMode ? 'Actualizar Anuncio' : 'Guardar Anuncio'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;