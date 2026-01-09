import React, { useState } from 'react';
import './NotificationBell.css';

const NotificationBell = ({ notifications = [], unreadCount = 0, setUnreadCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && typeof setUnreadCount === 'function') {
      setUnreadCount(0);
    }
  };
//Added for debugging, couldn't get it to work earlier, can be removed.
  console.log("Bell received notifications:", notifications);

  return (
    <div className="notification-wrapper">
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