import React, { useState, useEffect } from 'react';
import './Calendar.css';

function Calendar({ currentMonth, currentYear, weekDays, onDayClick }) {
    const [reservations, setReservations] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // Auto-refresh every 15 minutes (900000 milliseconds)
    useEffect(() => {
        const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

        const refreshTimer = setInterval(() => {
            console.log('Calendar auto-refreshing data (15 min interval)...');
            fetchReservations();
            setLastRefresh(new Date());
        }, REFRESH_INTERVAL);

        // Cleanup timer on unmount
        return () => clearInterval(refreshTimer);
    }, [currentMonth, currentYear]);

    // Fetch reservations when month/year changes
    useEffect(() => {
        fetchReservations();
    }, [currentMonth, currentYear]);

    const fetchReservations = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9090/api/reservations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Reservations fetched:', data);
                setReservations(data);

                // Extract unique booked dates
                const dates = [...new Set(data.map(r => r.date))];
                setBookedDates(dates);
            } else {
                console.error('Failed to fetch reservations:', response.status);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Manual refresh function
    const handleManualRefresh = async () => {
        console.log('Manual calendar refresh triggered...');
        await fetchReservations();
        setLastRefresh(new Date());
    };

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const getFirstDayOfMonth = (month, year) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const getReservationsForDate = (dateKey) => {
        return reservations.filter(r => r.date === dateKey);
    };

    // Get time since last refresh
    const getTimeSinceRefresh = () => {
        const now = new Date();
        const diff = Math.floor((now - lastRefresh) / 1000); // seconds

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return `${Math.floor(diff / 3600)}h ago`;
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
                            title={`${reservation.lab.name} - ${reservation.user.username} - ${reservation.startTime.substring(0, 5)}-${reservation.endTime.substring(0, 5)}`}
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
            {/* Calendar Header with Refresh Info */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '0 5px'
            }}>
                <div style={{ fontSize: '10px', color: '#999' }}>
                    Last updated: {getTimeSinceRefresh()}
                </div>
                <button
                    onClick={handleManualRefresh}
                    disabled={isLoading}
                    style={{
                        background: isLoading ? '#ccc' : '#880015',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '10px',
                        fontWeight: '600',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => !isLoading && (e.target.style.background = '#5a2828')}
                    onMouseLeave={(e) => !isLoading && (e.target.style.background = '#880015')}
                >
                    <i className="fa-solid fa-rotate" style={{
                        animation: isLoading ? 'spin 1s linear infinite' : 'none',
                        fontSize: '10px'
                    }}></i>
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Calendar Headers */}
            <div className="calendar-headers">
                {weekDays.map(day => (
                    <div className="calendar-header" key={day}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar">
                {isLoading && reservations.length === 0 ? (
                    <div className="calendar-loading" style={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                        fontSize: '14px',
                        color: '#880015'
                    }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                        Loading reservations...
                    </div>
                ) : (
                    renderCalendar()
                )}
            </div>
        </div>
    );
}

export default Calendar;