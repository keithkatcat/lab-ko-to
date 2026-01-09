import React, { useState, useRef, useEffect } from 'react';
import './NotificationBell.css';

const NotificationBell = ({ notifications = [], unreadCount = 0, setUnreadCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && typeof setUnreadCount === 'function') {
      setUnreadCount(0);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  console.log("Bell received notifications:", notifications);

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button type="button" className="bell-button" onClick={handleToggle}>
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">Booking Notifications</div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">No history yet</div>
            ) : (
              notifications.map((n) => {
                return (
                  <div key={n.id} className={`notif-item ${n.status}`}>
                    <p>{n.message}</p>
                    <span className="notif-time">{n.time}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;