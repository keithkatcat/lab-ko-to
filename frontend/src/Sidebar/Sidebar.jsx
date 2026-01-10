import React, { useState, useEffect } from 'react';
import './Sidebar.css';

export function Sidebar({
                            currentTime,
                            selectedDate,
                            onReservationUpdate,
                        }) {
    const [pendingReservations, setPendingReservations] = useState([]);
    const [approvedReservations, setApprovedReservations] = useState([]);
    const [allReservations, setAllReservations] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [allLabs, setAllLabs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // Auto-refresh every 15 minutes (900000 milliseconds)
    useEffect(() => {
        const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

        const refreshTimer = setInterval(() => {
            console.log('Auto-refreshing data (15 min interval)...');
            refreshAllData();
            setLastRefresh(new Date());
        }, REFRESH_INTERVAL);

        // Cleanup timer on unmount
        return () => clearInterval(refreshTimer);
    }, [isAdmin]);

    // Check if user is admin
    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setIsAdmin(userRole === 'admin');
    }, []);

    // Fetch all labs on mount
    useEffect(() => {
        fetchLabs();
    }, []);

    // Fetch reservations based on role
    useEffect(() => {
        if (isAdmin) {
            fetchPendingReservations();
            fetchAllReservations();
        } else {
            fetchAllReservations();
        }
    }, [isAdmin]);

    // Calculate available rooms when date is selected
    useEffect(() => {
        if (selectedDate && allLabs.length > 0) {
            calculateAvailableRooms(selectedDate);
        }
    }, [selectedDate, allReservations, allLabs]);

    // Function to refresh all data
    const refreshAllData = async () => {
        await fetchLabs();
        if (isAdmin) {
            await fetchPendingReservations();
        }
        await fetchAllReservations();
    };

    // Manual refresh button handler
    const handleManualRefresh = async () => {
        setIsLoading(true);
        console.log('Manual refresh triggered...');
        await refreshAllData();
        setLastRefresh(new Date());
        setIsLoading(false);
    };

    const fetchLabs = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:9090/api/labs', {
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : {}
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Labs fetched:', data);
                const activeLabs = data.filter(lab => lab.isActive);
                setAllLabs(activeLabs);
            } else {
                console.error('Failed to fetch labs:', response.status);
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
                console.log('Pending reservations:', data);
                setPendingReservations(data);
            } else {
                console.error('Failed to fetch pending reservations:', response.status);
            }
        } catch (error) {
            console.error('Error fetching pending reservations:', error);
        }
    };

    const fetchAllReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:9090/api/reservations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('All reservations:', data);
                setAllReservations(data);

                const approved = data.filter(r => r.status === 'approved');
                setApprovedReservations(approved);
            } else {
                console.error('Failed to fetch reservations:', response.status);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const calculateAvailableRooms = (date) => {
        console.log('Calculating available rooms for date:', date);

        const dateReservations = allReservations.filter(r =>
            r.date === date && (r.status === 'approved' || r.status === 'pending')
        );

        const bookedLabIds = dateReservations.map(r => r.lab.id);
        const available = allLabs.filter(lab => !bookedLabIds.includes(lab.id));

        setAvailableRooms(available);
    };

    const handleApprove = async (reservationId) => {
        if (!window.confirm('Are you sure you want to approve this reservation?')) {
            return;
        }

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
                alert('Reservation approved successfully!');

                await fetchPendingReservations();
                await fetchAllReservations();
                setLastRefresh(new Date());

                if (onReservationUpdate) {
                    onReservationUpdate();
                }
            } else {
                const error = await response.text();
                alert(`Failed to approve reservation: ${error}`);
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
                alert('Reservation denied');

                await fetchPendingReservations();
                await fetchAllReservations();
                setLastRefresh(new Date());

                if (onReservationUpdate) {
                    onReservationUpdate();
                }
            } else {
                const error = await response.text();
                alert(`Failed to deny reservation: ${error}`);
            }
        } catch (error) {
            console.error('Error denying reservation:', error);
            alert('Error denying reservation');
        } finally {
            setIsLoading(false);
        }
    };

    // Get time since last refresh
    const getTimeSinceRefresh = () => {
        const now = new Date();
        const diff = Math.floor((now - lastRefresh) / 1000); // seconds

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return `${Math.floor(diff / 3600)}h ago`;
    };

    // Styles
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

    const refreshButtonStyle = {
        marginTop: '8px',
        padding: '6px 12px',
        background: '#880015',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s',
        width: '100%',
        justifyContent: 'center'
    };

    const refreshInfoStyle = {
        fontSize: '10px',
        color: '#999',
        marginTop: '6px',
        textAlign: 'center'
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
        gap: '8px',
        marginTop: '12px'
    };

    const roomStyle = {
        background: '#F4EFEA',
        padding: '8px',
        borderRadius: '10px',
        textAlign: 'center',
        fontWeight: '800',
        color: '#C73A4A',
        fontSize: '13px',
    };

    const notAvailableStyle = {
        color: '#d85c5c',
        fontSize: '12px',
        fontWeight: 'bold',
        marginTop: '12px'
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
        marginBottom: '4px'
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
                    {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
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

                {/* Refresh Button */}
                <button
                    onClick={handleManualRefresh}
                    disabled={isLoading}
                    style={refreshButtonStyle}
                    onMouseEnter={(e) => !isLoading && (e.target.style.background = '#5a2828')}
                    onMouseLeave={(e) => (e.target.style.background = '#880015')}
                >
                    <i className="fa-solid fa-rotate" style={{
                        animation: isLoading ? 'spin 1s linear infinite' : 'none'
                    }}></i>
                    {isLoading ? 'Refreshing...' : 'Refresh Now'}
                </button>

                <div style={refreshInfoStyle}>
                    Last updated: {getTimeSinceRefresh()}
                    <br />
                    Auto-refresh: every 15 min
                </div>
            </div>

            {/* Available Rooms Section */}
            <div className="sidebar-section available-rooms-section">
                <div className="sidebar-section-title">
                    AVAILABLE ROOMS
                    {selectedDate && (
                        <span style={{ fontSize: '11px', fontWeight: 'normal', display: 'block', marginTop: '4px' }}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
              })}
            </span>
                    )}
                </div>

                {!selectedDate ? (
                    <div style={noDateStyle}>Click on a date to see available rooms</div>
                ) : (
                    <>
                        {availableRooms.length > 0 ? (
                            <div style={roomsGridStyle}>
                                {availableRooms.map((room) => (
                                    <div key={room.id} style={roomStyle} title={`Capacity: ${room.capacity}`}>
                                        {room.name}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={notAvailableStyle}>
                                {allLabs.length === 0 ? 'Loading labs...' : 'All rooms are booked for this date'}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Bookings Section - Only for Admin */}
            {isAdmin && (
                <div className="sidebar-section scrollable-booking-section">
                    <div className="sidebar-section-title">RESERVATIONS</div>

                    {/* Pending Requests */}
                    <div style={{ marginBottom: '20px' }}>
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
                                        {reservation.date} • {reservation.startTime.substring(0, 5)} - {reservation.endTime.substring(0, 5)}
                                    </div>
                                    <div style={bookingMetaStyle}>
                                        {reservation.program} • Section {reservation.section}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>
                                        Purpose: {reservation.purpose}
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
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
                            <div style={{ fontSize: '11px', color: '#2B0B10', opacity: 0.6 }}>
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
                                <div style={{ fontWeight: 'bold', color: '#333', fontSize: '11px' }}>
                                    {reservation.lab.name}
                                </div>
                                <div style={{ color: '#666', fontSize: '10px' }}>
                                    {reservation.user.username}
                                </div>
                                <div style={{ color: '#22c55e', fontSize: '10px', fontWeight: 'bold' }}>
                                    {reservation.date} • {reservation.startTime.substring(0, 5)}-{reservation.endTime.substring(0, 5)}
                                </div>
                            </div>
                        ))}

                        {approvedReservations.length === 0 && (
                            <div style={{ fontSize: '11px', color: '#2B0B10', opacity: 0.6 }}>
                                No approved bookings
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* My Reservations Section - Only for Users */}
            {!isAdmin && (
                <div className="sidebar-section scrollable-booking-section">
                    <div className="sidebar-section-title">MY RESERVATIONS</div>

                    {allReservations.length > 0 ? (
                        allReservations.map((reservation) => (
                            <div key={reservation.id} style={bookingCardStyle}>
                                <div style={bookingLabStyle}>{reservation.lab.name}</div>
                                <div style={bookingMetaStyle}>
                                    {reservation.date} • {reservation.startTime.substring(0, 5)} - {reservation.endTime.substring(0, 5)}
                                </div>
                                <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>
                                    {reservation.program} • Section {reservation.section}
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    color: reservation.status === 'approved' ? '#22c55e' :
                                        reservation.status === 'denied' ? '#ef4444' : '#fbbf24'
                                }}>
                                    Status: {reservation.status.toUpperCase()}
                                </div>
                                {reservation.adminNotes && (
                                    <div style={{ fontSize: '9px', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>
                                        Note: {reservation.adminNotes}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ fontSize: '11px', color: '#2B0B10', opacity: 0.6 }}>
                            No reservations yet
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Sidebar;