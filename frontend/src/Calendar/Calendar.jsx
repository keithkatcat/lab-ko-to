import React from 'react';
import './MainContent.css';
import './Calendar.css';

function Calendar({ currentMonth, currentYear, weekDays, events, bookedDates, onDayClick }) {
  
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div className="calendar-day empty" key={`empty-${i}`}></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const isBooked = bookedDates.includes(dateKey);
      const dayEvents = events[dateKey] || [];

      days.push(
        <div 
          className={`calendar-day ${isBooked ? 'booked' : ''}`} 
          key={day} 
          onClick={() => onDayClick(dateKey)} 
          style={{ cursor: 'pointer' }}
        >
          <div className="day-number">{day}</div>

          {dayEvents.map((event, idx) => (
            <div className={`event ${event.class}`} key={idx}>
              {event.time && <span>• {event.time} </span>}
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        {weekDays.map(day => (
          <div className="calendar-header" key={day}>
            {day}
          </div>
        ))}

        {renderCalendar()}
      </div>
    </div>
  );
}

export default Calendar;
