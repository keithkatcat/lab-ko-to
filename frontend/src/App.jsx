import { useState, useEffect, useMemo } from 'react';
import labkoto_logo from './assets/labkoto_logo.png';
import './App.css';

import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import Calendar from './Calendar/Calendar';
import BookingModal from './BookingModal/BookingModal';
import LoginSignup from './LoginSignup/LoginSignup';

const allLabRooms = [
  'S501', 'S502', 'S503', 'S504', 'S505',
  'S506', 'S507', 'S508', 'S509', 'S510'
];

const todayKey = new Date().toISOString().split('T')[0];

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(new Date());

  const [events, setEvents] = useState({});
  const [previousBookings, setPreviousBookings] = useState([]);
  const [bookedDates] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [eventForm, setEventForm] = useState({
    name: '',
    program: '',
    section: '',
    labRoom: '',
    purpose: '',
    dateRequested: '',
    timeRequested: '',
    startTime: '',
    endTime: ''
  });

  const availableRooms = useMemo(() => {
    if (!selectedDate) return allLabRooms;
    const dayEvents = events[selectedDate] || [];
    const bookedRoomNames = dayEvents.map(event => event.details.labRoom);
    return allLabRooms.filter(room => !bookedRoomNames.includes(room));
  }, [selectedDate, events]);

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
    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    // Reset authentication state
    setIsAuthenticated(false);
    setUserRole(null);
    setAuthToken(null);
    
    // Optional: Clear other app state
    setEvents({});
    setPreviousBookings([]);
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

  const handleAddEvent = (newEvent) => {
    const existingEvents = events[selectedDate] || [];
    const conflictingBooking = existingEvents.find(event =>
      event.details.labRoom === newEvent.labRoom &&
      event.details.timeRequested === newEvent.timeRequested
    );

    if (conflictingBooking) {
      createNotification(`Conflict: ${newEvent.labRoom} is already taken.`, 'rejected');
      return;
    }

    const updatedEvents = { ...events };
    if (!updatedEvents[selectedDate]) updatedEvents[selectedDate] = [];
    
    updatedEvents[selectedDate].push({
      time: newEvent.timeRequested,
      title: `PENDING: ${newEvent.labRoom}`,
      class: 'event-yellow',
      details: newEvent
    });

    createNotification(`Request Sent: ${newEvent.labRoom} for ${newEvent.name}`, 'pending');

    setEvents(updatedEvents);
    setShowModal(false);
    setEventForm({
      name: '', program: '', section: '', labRoom: '',
      purpose: '', dateRequested: '', timeRequested: '', startTime: '', endTime: ''
    });
  };

  const handleApprove = (date, index) => {
    const eventToApprove = events[date][index];
    setPreviousBookings(prev => [...prev, { ...eventToApprove, date }]);
    
    createNotification(`Confirmed: ${eventToApprove.details.labRoom} booking approved!`, 'success');

    const updatedEvents = { ...events };
    updatedEvents[date].splice(index, 1);
    if (updatedEvents[date].length === 0) delete updatedEvents[date];
    setEvents(updatedEvents);
  };

  const handleRemove = (date, index) => {
    const eventToRemove = events[date][index];
    
    createNotification(`Removed: Request for ${eventToRemove.details.labRoom} was cancelled.`, 'rejected');

    const updatedEvents = { ...events };
    updatedEvents[date].splice(index, 1);
    if (updatedEvents[date].length === 0) delete updatedEvents[date];
    setEvents(updatedEvents);
  };

  const handleDayClick = (dateKey) => {
    setSelectedDate(dateKey);
    setEventForm(prev => ({ ...prev, dateRequested: dateKey }));
    setShowModal(true);
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
        availableRooms={availableRooms}
        selectedDate={selectedDate}
        events={events}
        previousBookings={previousBookings}
        onApprove={handleApprove}
        onRemove={handleRemove}
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
          events={events}
          bookedDates={bookedDates}
          onDayClick={handleDayClick}
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