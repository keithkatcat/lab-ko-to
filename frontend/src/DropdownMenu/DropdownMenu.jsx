import React, { useState, useRef, useEffect } from 'react';
import './DropdownMenu.css';
import LogOut from '../LogOut/LogOut';

const DropdownMenu = ({
  isOpen,
  setIsOpen,
  userName = 'Fname Lname',
  userEmail = 'user@example.com',
  onViewProfile,
  onSettings,
  onReportProblem,
}) => {
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
  }, [setIsOpen]);

  const menuItems = [
    { label: 'View Profile', iconUrl: 'https://i.postimg.cc/vMCvJGcj/viewprofile.png', action: onViewProfile },
    { label: 'Settings', iconUrl: 'https://i.postimg.cc/vMCvJGcj/settings.png', action: onSettings },
    { label: 'Report a Problem', iconUrl: 'https://i.postimg.cc/vMCvJGcj/reportproblem.png', action: onReportProblem },
    { label: 'Log Out', iconUrl: 'https://i.postimg.cc/vMCvJGcj/logout.png', action: () => setShowLogoutModal(true) },
  ];

  const handleMenuItemClick = (action) => {
    if (action) action();
    setIsOpen(false);
  };

  return (
    <>
      <div className="dropdown-container" ref={dropdownRef}>
        <div className="dropdown-wrapper">
          <button
            className="dropdown-button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="User Menu"
          >
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

      <LogOut isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  );
};

export default DropdownMenu;
