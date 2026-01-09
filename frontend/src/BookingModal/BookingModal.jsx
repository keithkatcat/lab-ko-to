import React from 'react';

function BookingModal({ eventForm, setEventForm, onSubmit, onClose }) {
  const labRooms = [
    'S501', 'S502', 'S503', 'S504', 'S505', 'S506', 'S507', 'S508', 'S509', 'S510'
  ];

  const programs = ['Computer Science', 'Information Technology'];

  const purposes = ['Class Activity', 'Research', 'Org Meeting'];

  const isTimeRangeValid = (start, end) => {
    if (!start || !end) return false;
    return start < end; // 'HH:MM' lexicographic compare works
  };

  const isDisabled = !eventForm.name || !eventForm.labRoom || !eventForm.dateRequested || !isTimeRangeValid(eventForm.startTime, eventForm.endTime);

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
    zIndex: 11000
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
    opacity: isDisabled ? 0.5 : 1
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
          {[
            { label: 'Name', type: 'text', key: 'name' },
            { label: 'Program', type: 'select', key: 'program', options: programs },
            { label: 'Section', type: 'text', key: 'section', placeholder: 'e.g., 2-4' },
            { label: 'Labroom Requested', type: 'select', key: 'labRoom', options: labRooms },
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
              onClick={() => onSubmit({ ...eventForm, timeRequested: `${eventForm.startTime} - ${eventForm.endTime}` })}
              disabled={isDisabled}
              style={submitStyle}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingModal;
