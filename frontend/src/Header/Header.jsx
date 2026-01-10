import React, { useState } from 'react';
import './Header.css';
import NotificationBell from '../NotificationBell/NotificationBell.jsx';
import DropdownMenu from '../DropdownMenu/DropdownMenu.jsx';
import Settings from '../Settings/Settings.jsx';

export function Header({
                           labkoto_logo,
                           currentMonth,
                           currentYear,
                           setCurrentMonth,
                           setCurrentYear,
                           notifications = [],
                           unreadCount = 0,
                           setUnreadCount,
                           onLogout
                       }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get user info from localStorage
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

    const previousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    // Dropdown menu handlers
    const handleViewProfile = () => {
        console.log('View Profile clicked');
        // TODO: Implement profile view
        alert('Profile view coming soon!');
    };

    const handleSettings = () => {
        console.log('Settings clicked');
        setShowSettings(true);
        setIsDropdownOpen(false);
    };

    const handleReportProblem = () => {
        console.log('Report Problem clicked');
        // TODO: Implement report problem
        alert('Report problem coming soon!');
    };

    return (
        <>
            <div className="header">
                <div className="header-left">
                    <div className="logo">
                        <img
                            src={labkoto_logo}
                            alt="Logo"
                            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        />
                        <span className="logo-text">Lab Ko 'To</span>
                    </div>

                    <button className="btn-today" onClick={goToToday}>Today</button>

                    <div className="nav-controls">
                        <button className="nav-arrow" onClick={previousMonth}>‹</button>
                        <button className="nav-arrow" onClick={nextMonth}>›</button>
                        <span className="month-year-display">
              {monthNames[currentMonth]} {currentYear}
            </span>
                    </div>
                </div>

                <div className="header-right">
                    <NotificationBell
                        notifications={notifications}
                        unreadCount={unreadCount}
                        setUnreadCount={setUnreadCount}
                    />

                    <div
                        className="user-profile-circle"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(prev => !prev);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        👤
                    </div>
                </div>
            </div>

            {/* Dropdown Menu */}
            <DropdownMenu
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                userName={userName}
                userEmail={userEmail}
                onViewProfile={handleViewProfile}
                onSettings={handleSettings}
                onReportProblem={handleReportProblem}
            />

            {/* Settings Modal */}
            <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </>
    );
}

export default Header;