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
                if (onViewProfile) {
                    onViewProfile();
                }
                setIsOpen(false);
                setHoveredIndex(null);
                break;
            case 'settings':
                if (onSettings) {
                    onSettings();
                }
                // Don't close dropdown immediately for settings
                // It will be closed by the handler
                break;
            case 'report':
                if (onReportProblem) {
                    onReportProblem();
                }
                setIsOpen(false);
                setHoveredIndex(null);
                break;
            case 'logout':
                setShowLogoutModal(true);
                break;
            default:
                break;
        }
    };

    const handleCloseLogoutModal = () => {
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
                                className={`dropdown-item ${hoveredIndex === index ? 'hovered' : ''}`}
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