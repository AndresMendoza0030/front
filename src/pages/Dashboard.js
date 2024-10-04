import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../context/PermissionsContext';
const mockData = {
  recent_documents: [
    { filename: 'documento1.pdf' },
    { filename: 'documento2.pdf' }
  ],
  favorite_documents: [
    { filename: 'favorito1.pdf' },
    { filename: 'favorito2.pdf' }
  ],
  shared_documents: [
    { filename: 'compartido1.pdf', shared_by: 'María López' },
    { filename: 'compartido2.pdf', shared_by: 'Carlos García' }
  ],
  notifications: [
    { id: 1, message: 'Nueva actualización disponible.', filename: 'actualizacion1.pdf', is_read: 0, date: '2024-07-13' },
    { id: 2, message: 'Recordatorio de reunión.', filename: 'reunion.pdf', is_read: 0, date: '2024-07-14' }
  ],
  user_tasks: [
    { id: 1, description: 'Terminar reporte mensual', due_date: '2024-07-20' },
    { id: 2, description: 'Preparar presentación', due_date: '2024-07-22' }
  ],
  bulletin_board: [
    { id: 1, image: '/images/background.jpg', date: '2024-07-13' },
    { id: 2, image: '/images/background.jpg', date: '2024-07-14' },
    { id: 3, image: '/images/background.jpg', date: '2024-07-15' },
    { id: 4, image: '/images/background.jpg', date: '2024-07-16' },
    { id: 5, image: '/images/background.jpg', date: '2024-07-17' }
  ]
};

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
  const { username } = useAuth();
  useEffect(() => {
   
    console.log('Nombre de usuario recuperado de localStorage:', username); // Depuración
 
    
    const data = mockData;
    setRecentDocuments(data.recent_documents);
    setFavoriteDocuments(data.favorite_documents);
    setSharedDocuments(data.shared_documents);
    setNotifications(data.notifications);
    setUserTasks(data.user_tasks);
    setUnreadNotifications(data.notifications.filter(notification => notification.is_read === 0));
    setBulletinBoard(data.bulletin_board);
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

  return (
    <div className="dashboard-container">
      <div className="bulletin-board">
        <Carousel showArrows={true} autoPlay={true} infiniteLoop={true}>
          {bulletinBoard.map(announcement => (
            <div key={announcement.id}>
              <img src={announcement.image} alt={`Aviso ${announcement.id}`} />
              <p className="legend">{announcement.date}</p>
            </div>
          ))}
        </Carousel>
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
        <form method="post" enctype="multipart/form-data" action="/api/submits_feedback" className="feedback-form">
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
    </div>
  );
};

export default Dashboard;
