import React, { useState } from 'react';
import './LogOut.css';

const LogOut = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  console.log('LOGOUT COMPONENT: Rendering with isOpen =', isOpen);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('user');
     
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    } catch (error) {
      console.error('Error during logout:', error);
     
      localStorage.removeItem('token');
      localStorage.removeItem('user');
     
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    }
  };

  if (!isOpen) {
    console.log('LOGOUT COMPONENT: Not rendering (isOpen is false)');
    return null;
  }

  console.log('LOGOUT COMPONENT: Rendering modal!');

  return (
    <div className="logout-overlay" onClick={!loading ? onClose : undefined}>
      <div className="logout-container" onClick={(e) => e.stopPropagation()}>
        {!loading && (
          <button className="logout-close" onClick={onClose}>×</button>
        )}
       
        <div className="logout-content">
          <div className="logout-title">Log Out?</div>
          <div className="logout-message">
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </div>

          <div className="logout-divider"></div>

          {loading ? (
            <div className="logout-loading">
              <div className="logout-spinner"></div>
              <span>Logging out...</span>
            </div>
          ) : (
            <div className="logout-buttons">
              <button
                className="logout-confirm-btn"
                onClick={handleLogout}
              >
                Yes, Log Me Out
              </button>
              <button
                className="logout-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          )}

          {!loading && (
            <div className="logout-info">
              Your session data will be cleared from this device
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogOut;