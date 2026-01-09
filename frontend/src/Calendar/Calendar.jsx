import React, { useState, useEffect } from 'react';
import './Calendar.css';

function Calendar({ currentMonth, currentYear, weekDays, onDayClick }) {
    const [reservations, setReservations] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);

    useEffect(() => {
        fetchReservations();
    }, [currentMonth, currentYear]);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9090/api/reservations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setReservations(data);

                // Extract unique booked dates
                const dates = [...new Set(data.map(r => r.date))];
                setBookedDates(dates);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const getFirstDayOfMonth = (month, year) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const getReservationsForDate = (dateKey) => {
        return reservations.filter(r => r.date === dateKey);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        const today = new Date();
        const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

        // Empty days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div className="calendar-day empty" key={`empty-${i}`}></div>
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const isBooked = bookedDates.includes(dateKey);
            const dayReservations = getReservationsForDate(dateKey);
            const isToday = isCurrentMonth && today.getDate() === day;

            days.push(
                <div
                    className={`calendar-day ${isBooked ? 'booked' : ''} ${isToday ? 'today' : ''}`}
                    key={day}
                    onClick={() => onDayClick(dateKey)}
                >
                    <div className="day-number">{day}</div>

                    {dayReservations.slice(0, 3).map((reservation) => (
                        <div
                            className={`event event-${reservation.status}`}
                            key={reservation.id}
                            title={`${reservation.lab.name} - ${reservation.startTime}-${reservation.endTime}`}
                        >
                            <span className="event-time">• {reservation.startTime.substring(0, 5)}</span>
                            <span className="event-title">{reservation.lab.name}</span>
                        </div>
                    ))}

                    {dayReservations.length > 3 && (
                        <div className="event-count">
                            +{dayReservations.length - 3} more
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar-wrapper">
            <div className="calendar-headers">
                {weekDays.map(day => (
                    <div className="calendar-header" key={day}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar">
                {renderCalendar()}
            </div>
        </div>
    );
}

export default Calendar;