import React, {useState, useEffect} from 'react';
import './Sidebar.css';

export function Sidebar({
                            currentTime,
                            selectedDate,
                            onReservationUpdate, // Callback to refresh calendar data
                        }) {
    const [pendingReservations, setPendingReservations] = useState([]);
    const [approvedReservations, setApprovedReservations] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [allLabs, setAllLabs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all labs
    useEffect(() => {
        fetchLabs();
    }, []);

    // Fetch pending reservations
    useEffect(() => {
        fetchPendingReservations();
    }, []);

    // Calculate available rooms when date is selected
    useEffect(() => {
        if (selectedDate) {
            calculateAvailableRooms(selectedDate);
        }
    }, [selectedDate, approvedReservations]);

    const fetchLabs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9090/api/labs/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAllLabs(data.filter(lab => lab.isActive));
            }
        } catch (error) {
            console.error('Error fetching labs:', error);
        }
    };

    const fetchPendingReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await fetch(
                `http://localhost:9090/api/admin/reservations/pending?userId=${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setPendingReservations(data);
            }
        } catch (error) {
            console.error('Error fetching pending reservations:', error);
        }
    };

    const fetchApprovedReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9090/api/reservations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const approved = data.filter(r => r.status === 'approved');
                setApprovedReservations(approved);
            }
        } catch (error) {
            console.error('Error fetching approved reservations:', error);
        }
    };

    const calculateAvailableRooms = (date) => {
        // Get all reservations for the selected date
        const dateReservations = approvedReservations.filter(r => r.date === date);

        // Get booked lab IDs
        const bookedLabIds = dateReservations.map(r => r.lab.id);

        // Filter available labs
        const available = allLabs.filter(lab => !bookedLabIds.includes(lab.id));

        setAvailableRooms(available);
    };

    const handleApprove = async (reservationId) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await fetch(
                `http://localhost:9090/api/admin/reservations/${reservationId}/approve?userId=${userId}&notes=Approved`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                // Refresh pending reservations
                await fetchPendingReservations();
                await fetchApprovedReservations();

                // Notify parent to refresh calendar
                if (onReservationUpdate) {
                    onReservationUpdate();
                }

                alert('Reservation approved successfully!');
            } else {
                alert('Failed to approve reservation');
            }
        } catch (error) {
            console.error('Error approving reservation:', error);
            alert('Error approving reservation');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeny = async (reservationId) => {
        const reason = prompt('Enter reason for denial:');
        if (!reason) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await fetch(
                `http://localhost:9090/api/admin/reservations/${reservationId}/deny?userId=${userId}&notes=${encodeURIComponent(reason)}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                // Refresh pending reservations
                await fetchPendingReservations();

                // Notify parent to refresh calendar
                if (onReservationUpdate) {
                    onReservationUpdate();
                }

                alert('Reservation denied');
            } else {
                alert('Failed to deny reservation');
            }
        } catch (error) {
            console.error('Error denying reservation:', error);
            alert('Error denying reservation');
        } finally {
            setIsLoading(false);
        }
    };

    // Styles (keep your existing styles)
    const dateStyle = {
        fontSize: '24px',
        fontWeight: '900',
        color: '#C73A4A',
        lineHeight: '1',
        marginTop: '5px',
    };

    const dateSubStyle = {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#C73A4A',
        marginTop: '2px',
        opacity: 0.9,
    };

    const timeStyle = {
        fontSize: '13px',
        fontWeight: '700',
        color: '#880015',
        marginTop: '8px',
        opacity: 0.7,
    };

    const noDateStyle = {
        fontSize: '12px',
        color: '#8d4b3e',
        opacity: 0.7,
        marginTop: '10px'
    };

    const roomsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '6px'
    };

    const roomStyle = {
        background: '#F4EFEA',
        padding: '6px',
        borderRadius: '10px',
        textAlign: 'center',
        fontWeight: '800',
        color: '#C73A4A',
        fontSize: '12px',
    };

    const notAvailableStyle = {
        color: '#d85c5c',
        fontSize: '12px',
        fontWeight: 'bold'
    };

    const bookingCardStyle = {
        background: 'white',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    };

    const bookingLabStyle = {
        fontWeight: 'bold',
        color: '#8b1538',
        fontSize: '13px',
        marginBottom: '4px'
    };

    const bookingNameStyle = {
        fontSize: '11px',
        color: '#555',
        marginBottom: '2px'
    };

    const bookingMetaStyle = {
        fontSize: '10px',
        color: '#999',
        marginBottom: '8px'
    };

    const buttonStyle = {
        border: 'none',
        borderRadius: '6px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: '600',
        transition: 'all 0.2s',
    };

    const approveBtnStyle = {
        ...buttonStyle,
        background: '#22c55e',
        color: 'white',
    };

    const denyBtnStyle = {
        ...buttonStyle,
        background: '#ef4444',
        color: 'white',
    };

    const approvedBookingStyle = {
        background: '#F4EFEA',
        padding: '10px',
        borderRadius: '12px',
        marginBottom: '6px',
        fontSize: '11px',
    };

    return (
        <div className="sidebar">
            {/* Current Date Section */}
            <div className="sidebar-section">
                <div className="sidebar-section-title">CURRENT DATE</div>

                <div style={dateStyle}>
                    {currentTime.toLocaleDateString('en-US', {weekday: 'long'})}
                </div>

                <div style={dateSubStyle}>
                    {currentTime.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </div>

                <div style={timeStyle}>
                    {currentTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })}
                </div>
            </div>

            {/* Available Rooms Section */}
            <div className="sidebar-section available-rooms-section">
                <div className="sidebar-section-title">
                    AVAILABLE ROOMS
                    {selectedDate && (
                        <span style={{fontSize: '11px', fontWeight: 'normal', display: 'block'}}>
              ({selectedDate})
            </span>
                    )}
                </div>

                {!selectedDate ? (
                    <div style={noDateStyle}>Select a date to see available rooms</div>
                ) : (
                    <div style={{marginTop: '12px'}}>
                        {availableRooms.length > 0 ? (
                            <div style={roomsGridStyle}>
                                {availableRooms.map((room) => (
                                    <div key={room.id} style={roomStyle}>
                                        {room.name}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={notAvailableStyle}>All rooms are booked</div>
                        )}
                    </div>
                )}
            </div>

            {/* Bookings Section */}
            <div className="sidebar-section scrollable-booking-section">
                <div className="sidebar-section-title">RESERVATIONS</div>

                {/* Pending Requests */}
                <div style={{marginBottom: '20px'}}>
                    <div className="booking-subtitle">
                        Pending Requests ({pendingReservations.length})
                    </div>

                    {pendingReservations.length > 0 ? (
                        pendingReservations.map((reservation) => (
                            <div key={reservation.id} style={bookingCardStyle}>
                                <div style={bookingLabStyle}>{reservation.lab.name}</div>
                                <div style={bookingNameStyle}>
                                    {reservation.user.username} ({reservation.user.accountType})
                                </div>
                                <div style={bookingMetaStyle}>
                                    {reservation.date} • {reservation.startTime} - {reservation.endTime}
                                </div>
                                <div style={bookingMetaStyle}>
                                    {reservation.program} • Section {reservation.section}
                                </div>
                                <div style={{fontSize: '10px', color: '#666', marginBottom: '8px'}}>
                                    Purpose: {reservation.purpose}
                                </div>

                                <div style={{display: 'flex', gap: '6px', justifyContent: 'flex-end'}}>
                                    <button
                                        onClick={() => handleApprove(reservation.id)}
                                        style={approveBtnStyle}
                                        disabled={isLoading}
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        onClick={() => handleDeny(reservation.id)}
                                        style={denyBtnStyle}
                                        disabled={isLoading}
                                    >
                                        ✕ Deny
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{fontSize: '11px', color: '#2B0B10', opacity: 0.6}}>
                            No pending requests
                        </div>
                    )}
                </div>

                {/* Approved Bookings */}
                <div>
                    <div className="booking-subtitle">
                        Approved Bookings ({approvedReservations.length})
                    </div>

                    {approvedReservations.slice(0, 5).map((reservation) => (
                        <div key={reservation.id} style={approvedBookingStyle}>
                            <div style={{fontWeight: 'bold', color: '#333', fontSize: '11px'}}>
                                {reservation.lab.name}
                            </div>
                            <div style={{color: '#666', fontSize: '10px'}}>
                                {reservation.user.username}
                            </div>
                            <div style={{color: '#22c55e', fontSize: '10px', fontWeight: 'bold'}}>
                                {reservation.date} • {reservation.startTime}-{reservation.endTime}
                            </div>
                        </div>
                    ))}

                    {approvedReservations.length === 0 && (
                        <div style={{fontSize: '11px', color: '#2B0B10', opacity: 0.6}}>
                            No approved bookings
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;