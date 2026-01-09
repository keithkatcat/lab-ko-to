import { useState, useEffect, useMemo } from 'react';
import labkoto_logo from './assets/labkoto_logo.png';
import './App.css';

import Sidebar from './Sidebar/Sidebar.jsx';
import Header from './Header/Header.jsx';
import Calendar from './Calendar/Calendar.jsx';
import BookingModal from './BookingModal/BookingModal.jsx';
import DropdownMenu from './DropdownMenu/DropdownMenu.jsx';
import ViewProfile from "./ViewProfile/ViewProfile.jsx";
import Settings from "./Settings/Settings.jsx";
import ReportProblem from "./ReportProblem/ReportProblem.jsx";

const allLabRooms = [
  'S501', 'S502', 'S503', 'S504', 'S505',
  'S506', 'S507', 'S508', 'S509', 'S510'
];

const todayKey = new Date().toISOString().split('T')[0];

function App() {
  // Calendar and booking state
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

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [userName, setUserName] = useState('Fname Lname');
  const [userEmail, setUserEmail] = useState('user@example.com');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        console.log('No token/userId found, using default values');
        return;
      }

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
        localStorage.setItem('userEmail', user.email || 'user@example.com');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    if (updatedData.fullName) {
      setUserName(updatedData.fullName);
    }
    fetchUserData();
  };

  const availableRooms = useMemo(() => {
    if (!selectedDate) return allLabRooms;
    const dayEvents = events[selectedDate] || [];
    const bookedRoomNames = dayEvents.map(event => event.details.labRoom);
    return allLabRooms.filter(room => !bookedRoomNames.includes(room));
  }, [selectedDate, events]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      purpose: '', dateRequested: '', timeRequested: ''
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

 const handleOpenProfile = () => {
  console.log('=== Opening Profile ===');
  setIsDropdownOpen(false);
  setTimeout(() => {
    console.log('Setting isProfileOpen to true');
    setIsProfileOpen(true);
  }, 100);
};

const handleOpenSettings = () => {
  console.log('=== Opening Settings ===');
  setIsDropdownOpen(false);
  setTimeout(() => {
    console.log('Setting isSettingsOpen to true');
    setIsSettingsOpen(true);
  }, 100);
};

const handleOpenReport = () => {
  console.log('=== Opening Report ===');
  setIsDropdownOpen(false);
  setTimeout(() => {
    console.log('Setting isReportOpen to true');
    setIsReportOpen(true);
  }, 100);
};

  useEffect(() => {
    console.log('Modal States:', {
      isProfileOpen,
      isSettingsOpen,
      isReportOpen
    });
  }, [isProfileOpen, isSettingsOpen, isReportOpen]);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <DropdownMenu 
        isOpen={isDropdownOpen}
        setIsOpen={setIsDropdownOpen}
        userName={userName}
        userEmail={userEmail}
        onViewProfile={handleOpenProfile}
        onSettings={handleOpenSettings}
        onReportProblem={handleOpenReport}
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

        <div className="main-content">
          <Header
            labkoto_logo={labkoto_logo}
            currentMonth={currentMonth}
            currentYear={currentYear}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            setIsDropdownOpen={setIsDropdownOpen}
            notifications={notifications}
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
          />

          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            weekDays={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']}
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

      {isProfileOpen && (
        <ViewProfile 
          isOpen={isProfileOpen}
          onClose={() => {
            console.log('Closing ViewProfile');
            setIsProfileOpen(false);
          }}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
      
      {isSettingsOpen && (
        <Settings 
          isOpen={isSettingsOpen}
          onClose={() => {
            console.log('Closing Settings');
            setIsSettingsOpen(false);
          }}
        />
      )}
      
      {isReportOpen && (
        <ReportProblem 
          isOpen={isReportOpen}
          onClose={() => {
            console.log('Closing ReportProblem');
            setIsReportOpen(false);
          }}
        />
      )}
    </div>
  );
}


export default App;
