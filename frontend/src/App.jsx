import { useState, useEffect, useMemo } from 'react';
import labkoto_logo from './assets/labkoto_logo.png';
import './App.css';

import Sidebar from './Sidebar';
import Header from './header';
import Calendar from './Calendar';
import BookingModal from './BookingModal';

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

  const handleAddEvent = (newEvent) => {
    const existingEvents = events[selectedDate] || [];
    const conflictingBooking = existingEvents.find(event =>
      event.details.labRoom === newEvent.labRoom &&
      event.details.timeRequested === newEvent.timeRequested
    );

    if (conflictingBooking) {
      alert(`${newEvent.labRoom} is already booked at ${newEvent.timeRequested} on this date.`);
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
      name: '', program: '', section: '', labRoom: '',
      purpose: '', dateRequested: '', timeRequested: ''
    });
  };

  const handleApprove = (date, index) => {
    const eventToApprove = events[date][index];
    setPreviousBookings(prev => [...prev, { ...eventToApprove, date }]);
    
    const updatedEvents = { ...events };
    updatedEvents[date].splice(index, 1);
    if (updatedEvents[date].length === 0) delete updatedEvents[date];
    setEvents(updatedEvents);
  };

  const handleRemove = (date, index) => {
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
