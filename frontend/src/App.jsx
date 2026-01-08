import { useState, useEffect, useMemo } from 'react';
import labkoto_logo from './assets/labkoto_logo.png';
import './App.css';

import Sidebar from "./Sidebar/Sidebar.jsx";
import Header from "./Header/Header.jsx";
import Calendar from "./Calendar/Calendar.jsx";
import BookingModal from "./BookingModal/BookingModal.jsx";
import DropdownMenu from "./DropdownMenu/DropdownMenu.jsx";
import ViewProfile from "./ViewProfile/ViewProfile.jsx";
import Settings from "./Settings/Settings.jsx";
import ReportProblem from "./ReportProblem/ReportProblem.jsx";
import LogOut from "./LogOut/LogOut.jsx";

const allLabRooms = [
  'S501', 'S502', 'S503', 'S504', 'S505',
  'S506', 'S507', 'S508', 'S509', 'S510'
];

const todayKey = new Date().toISOString().split('T')[0];

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [events, setEvents] = useState({});
  const [previousBookings, setPreviousBookings] = useState([]);
  const [bookedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const [eventForm, setEventForm] = useState({
    name: '',
    program: '',
    section: '',
    labRoom: '',
    purpose: '',
    dateRequested: '',
    timeRequested: ''
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const [userName, setUserName] = useState('Fname Lname');
  const [userEmail, setUserEmail] = useState('user@example.com');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) return;

      const res = await fetch('http://localhost:9090/api/admin/users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const users = await res.json();
      const user = users.find(u => u.id === parseInt(userId));

      if (user) {
        setUserName(user.fullName || user.username || 'User');
        setUserEmail(user.email || 'user@example.com');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setUserName(updatedData.fullName);
    fetchUserData();
  };

  const availableRooms = useMemo(() => {
    if (!selectedDate) return allLabRooms;

    const dayEvents = events[selectedDate] || [];
    const bookedRooms = dayEvents.map(e => e.details.labRoom);

    return allLabRooms.filter(room => !bookedRooms.includes(room));
  }, [selectedDate, events]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddEvent = (newEvent) => {
    const existingEvents = events[selectedDate] || [];

    const conflict = existingEvents.find(event =>
      event.details.labRoom === newEvent.labRoom &&
      event.details.timeRequested === newEvent.timeRequested
    );

    if (conflict) {
      alert(`${newEvent.labRoom} is already booked at ${newEvent.timeRequested}`);
      return;
    }

    const updatedEvents = { ...events };

    if (!updatedEvents[selectedDate]) updatedEvents[selectedDate] = [];

    updatedEvents[selectedDate].push({
      time: newEvent.timeRequested,
      title: `${newEvent.labRoom} - ${newEvent.name}`,
      class: 'event-yellow',
      details: newEvent
    });

    setEvents(updatedEvents);
    setShowModal(false);
    setEventForm({
      name: '',
      program: '',
      section: '',
      labRoom: '',
      purpose: '',
      dateRequested: '',
      timeRequested: ''
    });
  };

  const handleApprove = (date, index) => {
    const event = events[date][index];
    setPreviousBookings(prev => [...prev, { ...event, date }]);

    const updated = { ...events };
    updated[date].splice(index, 1);
    if (updated[date].length === 0) delete updated[date];
    setEvents(updated);
  };

  const handleRemove = (date, index) => {
    const updated = { ...events };
    updated[date].splice(index, 1);
    if (updated[date].length === 0) delete updated[date];
    setEvents(updated);
  };

  const handleDayClick = (dateKey) => {
    setSelectedDate(dateKey);
    setEventForm(prev => ({ ...prev, dateRequested: dateKey }));
    setShowModal(true);
  };

  return (
    <>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <DropdownMenu
          userName={userName}
          userEmail={userEmail}
          onViewProfile={() => setIsProfileOpen(true)}
          onSettings={() => setIsSettingsOpen(true)}
          onReportProblem={() => setIsReportOpen(true)}
          onLogout={() => setIsLogoutOpen(true)}
        />

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

          <Header
            labkoto_logo={labkoto_logo}
            currentMonth={currentMonth}
            currentYear={currentYear}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
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

      <ViewProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdate={handleProfileUpdate}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userId={localStorage.getItem('userId')}
      />

      <ReportProblem
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      <LogOut
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </>
  );
}

export default App;
