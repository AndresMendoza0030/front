// src/components/BaseLayout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BaseLayout.css';

const BaseLayout = ({ children, flashMessages }) => {
  React.useEffect(() => {
    if (flashMessages && flashMessages.length > 0) {
      flashMessages.forEach(message => {
        toast(message);
      });
    }
  }, [flashMessages]);

  return (
    <div className="base-layout">
      <Header />
      <div className="content">
        {children}
        <ToastContainer containerId="my-toast-container" />
      </div>
      <Footer />
     
    </div>
  );
};

export default BaseLayout;
