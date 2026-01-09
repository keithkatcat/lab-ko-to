import React, { useState, useEffect } from 'react';

function BookingModal({ eventForm, setEventForm, onSubmit, onClose }) {
    const [labs, setLabs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const programs = ['Computer Science', 'Information Technology'];
    const purposes = ['Class Activity', 'Research', 'Org Meeting'];

    // Fetch available labs from API
    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:9090/api/labs', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setLabs(data);
                } else {
                    console.error('Failed to fetch labs');
                    // Fallback to hardcoded labs
                    setLabs([
                        { id: 1, name: 'S501' },
                        { id: 2, name: 'S502' },
                        { id: 3, name: 'S503' },
                        { id: 4, name: 'S504' },
                        { id: 5, name: 'S505' },
                        { id: 6, name: 'S506' },
                        { id: 7, name: 'S507' },
                        { id: 8, name: 'S508' },
                        { id: 9, name: 'S509' },
                        { id: 10, name: 'S510' }
                    ]);
                }
            } catch (err) {
                console.error('Error fetching labs:', err);
                setError('Failed to load labs');
            }
        };

        fetchLabs();
    }, []);

    const isTimeRangeValid = (start, end) => {
        if (!start || !end) return false;
        return start < end;
    };

    const isDisabled = !eventForm.name || !eventForm.labRoom || !eventForm.program ||
        !eventForm.section || !eventForm.purpose || !eventForm.dateRequested ||
        !isTimeRangeValid(eventForm.startTime, eventForm.endTime);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId'); // You need to store this during login

            // Find the lab ID from the selected lab name
            const selectedLab = labs.find(lab => lab.name === eventForm.labRoom);
            const labId = selectedLab ? selectedLab.id : null;

            if (!labId) {
                setError('Invalid lab selection');
                setIsLoading(false);
                return;
            }

            if (!userId) {
                setError('User not authenticated. Please login again.');
                setIsLoading(false);
                return;
            }

            // Prepare reservation data
            const reservationData = {
                date: eventForm.dateRequested,
                startTime: eventForm.startTime,
                endTime: eventForm.endTime,
                purpose: eventForm.purpose,
                program: eventForm.program,
                section: eventForm.section
            };

            // Create reservation
            const response = await fetch(
                `http://localhost:9090/api/reservations?userId=${userId}&labId=${labId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(reservationData)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess('Reservation submitted successfully! Awaiting admin approval.');

                // Call the parent's onSubmit callback with the created reservation
                setTimeout(() => {
                    onSubmit({
                        ...eventForm,
                        id: data.id,
                        status: data.status,
                        timeRequested: `${eventForm.startTime} - ${eventForm.endTime}`
                    });
                    onClose();
                }, 1500);
            } else {
                // Handle specific error messages from backend
                setError(data.message || 'Failed to create reservation');
            }
        } catch (err) {
            console.error('Error creating reservation:', err);
            setError('Unable to connect to server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        height: '40px',
        padding: '0 12px',
        border: '1px solid #d1d5db',
        borderRadius: '10px',
        fontSize: '14px',
        background: '#FFFFFF',
        color: '#000000',
        boxSizing: 'border-box',
        display: 'block',
        fontWeight: '500'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        fontSize: '12px',
        fontWeight: '900',
        color: '#000000',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
    };

    const modalStyle = {
        background: '#facccc',
        borderRadius: '25px',
        width: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        position: 'relative',
        border: 'none'
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: '#880015',
        color: 'white',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        cursor: 'pointer',
        fontWeight: 'bold',
        zIndex: 11000,
        border: 'none',
        borderRadius: '50%'
    };

    const headerStyle = {
        background: '#880015',
        padding: '35px 50px',
        textAlign: 'center',
        color: 'white',
        borderTopLeftRadius: '25px',
        borderTopRightRadius: '25px'
    };

    const headerTitleStyle = {
        margin: 0,
        fontSize: '22px',
        fontWeight: '900',
        lineHeight: 1.2,
        paddingRight: '20px'
    };

    const contentStyle = { padding: '30px 50px' };

    const submitStyle = {
        padding: '12px 60px',
        border: 'none',
        borderRadius: '30px',
        background: '#880015',
        color: 'white',
        cursor: 'pointer',
        fontWeight: '900',
        fontSize: '16px',
        textTransform: 'uppercase',
        transition: '0.2s',
        opacity: isDisabled || isLoading ? 0.5 : 1
    };

    const messageStyle = {
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        fontSize: '14px',
        textAlign: 'center'
    };

    const errorStyle = {
        ...messageStyle,
        background: '#fee',
        color: '#c00',
        border: '1px solid #fcc'
    };

    const successStyle = {
        ...messageStyle,
        background: '#efe',
        color: '#0a0',
        border: '1px solid #cfc'
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button
                    onClick={onClose}
                    style={closeButtonStyle}
                    onMouseEnter={(e) => (e.target.style.background = '#5a2828')}
                    onMouseLeave={(e) => (e.target.style.background = '#880015')}
                >
                    ✕
                </button>

                <div style={headerStyle}>
                    <h2 style={headerTitleStyle}>LABORATORY ROOM BOOKING REQUEST FORM</h2>
                </div>

                <div style={contentStyle}>
                    {error && <div style={errorStyle}>{error}</div>}
                    {success && <div style={successStyle}>{success}</div>}

                    {[
                        { label: 'Name', type: 'text', key: 'name', placeholder: 'Enter your full name' },
                        { label: 'Program', type: 'select', key: 'program', options: programs },
                        { label: 'Section', type: 'text', key: 'section', placeholder: 'e.g., 2-4 or 3-1' },
                        { label: 'Labroom Requested', type: 'select', key: 'labRoom', options: labs.map(lab => lab.name) },
                        { label: 'Purpose', type: 'select', key: 'purpose', options: purposes },
                        { label: 'Date Requested', type: 'text', key: 'dateRequested', readOnly: true },
                        { label: 'Start Time', type: 'time', key: 'startTime' },
                        { label: 'End Time', type: 'time', key: 'endTime' }
                    ].map((field) => (
                        <div key={field.key} style={{ marginBottom: '18px' }}>
                            <label style={labelStyle}>
                                {field.label} <span style={{ color: '#880015' }}>*</span>
                            </label>

                            {field.type === 'select' ? (
                                <select
                                    value={eventForm[field.key]}
                                    onChange={(e) => setEventForm({ ...eventForm, [field.key]: e.target.value })}
                                    style={inputStyle}
                                    disabled={isLoading}
                                >
                                    <option value="" style={{ color: '#666' }}>
                                        Select {field.label}
                                    </option>
                                    {field.options.map((opt) => (
                                        <option key={opt} value={opt} style={{ color: '#000000' }}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={eventForm[field.key] || ''}
                                    readOnly={field.readOnly}
                                    onChange={(e) => setEventForm({ ...eventForm, [field.key]: e.target.value })}
                                    disabled={isLoading}
                                    style={
                                        field.readOnly
                                            ? { ...inputStyle, cursor: 'not-allowed', color: '#333', backgroundColor: '#e5e7eb' }
                                            : inputStyle
                                    }
                                />
                            )}

                            {field.key === 'endTime' && eventForm.startTime && eventForm.endTime && !isTimeRangeValid(eventForm.startTime, eventForm.endTime) && (
                                <div style={{ color: '#d9534f', fontSize: '12px', marginTop: '6px' }}>
                                    End time must be later than start time
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button
                            onClick={handleSubmit}
                            disabled={isDisabled || isLoading}
                            style={submitStyle}
                            onMouseEnter={(e) => !isDisabled && !isLoading && (e.target.style.background = '#5a2828')}
                            onMouseLeave={(e) => (e.target.style.background = '#880015')}
                        >
                            {isLoading ? 'SUBMITTING...' : 'SUBMIT'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingModal;