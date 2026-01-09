import React, { useState, useRef, useEffect } from 'react';
import './DropdownMenu.css';
import LogOut from '../LogOut/LogOut';

const DropdownMenu = ({ 
  isOpen, 
  setIsOpen, 
  userName = "Fname Lname", 
  userEmail = "user@example.com", 
  onViewProfile, 
  onSettings, 
  onReportProblem 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  const firstName = userName.split(' ')[0];

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Only close dropdown if logout modal is NOT showing
        if (!showLogoutModal) {
          setIsOpen(false);
          setHoveredIndex(null);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, showLogoutModal, setIsOpen]);

  // Load Google Fonts
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

  const handleMenuItemClick = (action, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Menu item clicked:', action);
    
    switch(action) {
      case 'viewProfile':
        console.log('Calling onViewProfile');
        if (onViewProfile) {
          onViewProfile();
        }
        // Close dropdown after a small delay to ensure modal opens
        setTimeout(() => {
          setIsOpen(false);
          setHoveredIndex(null);
        }, 0);
        break;
      case 'settings':
        console.log('Calling onSettings');
        if (onSettings) {
          onSettings();
        }
        setTimeout(() => {
          setIsOpen(false);
          setHoveredIndex(null);
        }, 0);
        break;
      case 'report':
        console.log('Calling onReportProblem');
        if (onReportProblem) {
          onReportProblem();
        }
        setTimeout(() => {
          setIsOpen(false);
          setHoveredIndex(null);
        }, 0);
        break;
      case 'logout':
        console.log('Logout clicked, setting showLogoutModal to true');
        setShowLogoutModal(true);
        break;
      default:
        break;
    }
  };

  const handleCloseLogoutModal = () => {
    console.log('Closing logout modal');
    setShowLogoutModal(false);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="dropdown-container">
        <div className="dropdown-wrapper">
          <div className="dropdown-menu" ref={dropdownRef}>
            <div className="dropdown-userinfo">
              <div className="dropdown-username">Hi, {firstName}!</div>
              <div className="dropdown-useremail">{userEmail}</div>
            </div>
           
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`dropdown-item ${hoveredIndex === index ? 'hovered' : ''} ${index === menuItems.length - 1 ? 'last-item' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={(e) => handleMenuItemClick(item.action, e)}
                type="button"
              >
                <div className="dropdown-icon">
                  <img src={item.iconUrl} alt={item.label} />
                </div>
                <span className="dropdown-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <LogOut 
          isOpen={showLogoutModal} 
          onClose={handleCloseLogoutModal}
        />
      )}
    </>
  );
};

export default DropdownMenu;