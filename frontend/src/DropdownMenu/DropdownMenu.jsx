import React, { useState, useRef, useEffect } from 'react';
import './DropdownMenu.css';
import LogOut from '../LogOut/LogOut';

const DropdownMenu = ({ userName = "Fname Lname", userEmail = "user@example.com", onViewProfile, onSettings, onReportProblem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  const firstName = userName.split(' ')[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHoveredIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const menuItems = [
    { label: 'View Profile', iconUrl: 'https://i.postimg.cc/vMCvJGcj/userpx.png', action: 'viewProfile' },
    { label: 'Settings', iconUrl: 'https://i.postimg.cc/TYqmmMjJ/settingpx.png', action: 'settings' },
    { label: 'Report a problem', iconUrl: 'https://i.postimg.cc/MKbRR20D/image_removebg_preview_6.png', action: 'report' },
    { label: 'Log Out', iconUrl: 'https://i.postimg.cc/yx0Rv2M7/image_removebg_preview_7.png', action: 'logout' }
  ];

  const handleMenuItemClick = (action) => {
    setIsOpen(false);
    setHoveredIndex(null);
    
    setTimeout(() => {
      switch(action) {
        case 'viewProfile':
          if (onViewProfile) onViewProfile();
          break;
        case 'settings':
          if (onSettings) onSettings();
          break;
        case 'report':
          if (onReportProblem) onReportProblem();
          break;
        case 'logout':
          setShowLogoutModal(true);
          break;
        default:
          break;
      }
    }, 0);
  };

  const handleLogoutClose = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="dropdown-page">
        <div ref={dropdownRef} className="dropdown-container">
          <div className="dropdown-wrapper">
            <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
              <img
                src="https://i.postimg.cc/vMCvJGcj/userpx.png"
                alt="User Avatar"
                className="dropdown-avatar"
              />
            </button>
           
            {isOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-userinfo">
                  <div className="dropdown-username">Hi, {firstName}!</div>
                  <div className="dropdown-useremail">{userEmail}</div>
                </div>
               
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuItemClick(item.action);
                    }}
                    className={`dropdown-item ${hoveredIndex === index ? 'hovered' : ''} ${index === 3 ? 'last-item' : ''}`}
                  >
                    <span className="dropdown-icon">
                      <img src={item.iconUrl} alt={item.label} />
                    </span>
                    <span className="dropdown-label">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <LogOut isOpen={showLogoutModal} onClose={handleLogoutClose} />
    </>
  );
};

export default DropdownMenu;