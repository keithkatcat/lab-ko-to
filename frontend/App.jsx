import { useState, useEffect } from 'react';
import labkoto_logo from './assets/labkoto_logo.png';
import './App.css';

import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import Calendar from './Calendar/Calendar';
import BookingModal from './BookingModal/BookingModal';
import LoginSignup from './LoginSignup/LoginSignup';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentTime, setCurrentTime] = useState(new Date());

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventForm, setEventForm] = useState({
        name: '',
        program: '',
        section: '',
        labRoom: '',
        purpose: '',
        dateRequested: '',
        startTime: '',
        endTime: ''
    });

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Check for existing authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');

        if (token && role && userId && userName) {
            setIsAuthenticated(true);
            setUserRole(role);
            setAuthToken(token);
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Handle successful login
    const handleLoginSuccess = (role) => {
        setIsAuthenticated(true);
        setUserRole(role);
        const token = localStorage.getItem('token');
        setAuthToken(token);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');

        setIsAuthenticated(false);
        setUserRole(null);
        setAuthToken(null);

        setNotifications([]);
        setUnreadCount(0);
    };

    const createNotification = (message, status) => {
        const newNotif = {
            id: Date.now(),
            message: message,
            status: status,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const handleAddEvent = async (newEvent) => {
        try {
            createNotification(
                `Reservation submitted for ${newEvent.labRoom} on ${newEvent.dateRequested}`,
                'pending'
            );

            setRefreshTrigger(prev => prev + 1);
            setShowModal(false);

            const userName = localStorage.getItem('userName');
            setEventForm({
                name: userName || '',
                program: '',
                section: '',
                labRoom: '',
                purpose: '',
                dateRequested: '',
                startTime: '',
                endTime: ''
            });
        } catch (error) {
            createNotification('Failed to submit reservation', 'rejected');
        }
    };

    const handleDayClick = (dateKey) => {
        setSelectedDate(dateKey);
        setEventForm(prev => ({ ...prev, dateRequested: dateKey }));
        setShowModal(true);
    };

    const handleReservationUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <LoginSignup onLoginSuccess={handleLoginSuccess} />;
    }

    // Show main app if authenticated
    return (
        <div className="container">
            <Sidebar
                currentTime={currentTime}
                selectedDate={selectedDate}
                onReservationUpdate={handleReservationUpdate}
                key={`sidebar-${refreshTrigger}`}
            />

            <div className="main-content">
                <Header
                    labkoto_logo={labkoto_logo}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    setCurrentMonth={setCurrentMonth}
                    setCurrentYear={setCurrentYear}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    setUnreadCount={setUnreadCount}
                    onLogout={handleLogout}
                />

                <Calendar
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    weekDays={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
                    onDayClick={handleDayClick}
                    key={`calendar-${refreshTrigger}`}
                />

                {showModal && (
                    <BookingModal
                        eventForm={eventForm}
                        setEventForm={setEventForm}
                        onSubmit={handleAddEvent}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default App;