import React, { useState } from 'react';
import '../MainContent/MainContent.css';
import './Header.css';
import DropdownMenu from '../DropdownMenu/DropdownMenu.jsx';

export function Header({ labkoto_logo, currentMonth, currentYear, setCurrentMonth, setCurrentYear }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  return (
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
        <div 
          className="user-profile-circle" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{ cursor: 'pointer' }}
        >
          
        </div>
        
        <DropdownMenu 
          isOpen={isDropdownOpen}
          setIsOpen={setIsDropdownOpen}
          userName="John Doe"
          userEmail="john@example.com"
          onViewProfile={() => console.log('View Profile')}
          onSettings={() => console.log('Settings')}
          onReportProblem={() => console.log('Report Problem')}
        />
      </div>
    </div>
  );
}

export default Header;
