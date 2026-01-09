import React from 'react';

function BookingModal({ eventForm, setEventForm, onSubmit, onClose }) {
  const labRooms = ['S501', 'S502', 'S503', 'S504', 'S505', 'S506', 'S507', 'S508', 'S509', 'S510'];
  const programs = ['Computer Science', 'Information Technology'];
  const purposes = ['Class Activity', 'Research', 'Org Meeting'];
  const times = [
    '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM'
  ];

  const inputStyle = {
    width: '100%',
    height: '40px',
    padding: '0 12px',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '14px',
    background: '#F4EFEA',
    boxSizing: 'border-box',
    display: 'block'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    fontWeight: '900',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#facccc',
        borderRadius: '25px',
        width: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        <div style={{
          background: '#880015',
          padding: '30px 40px',
          textAlign: 'center',
          color: 'white',
          borderTopLeftRadius: '25px',
          borderTopRightRadius: '25px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '900',
            letterSpacing: '1px'
          }}>
            LABORATORY ROOM BOOKING REQUEST FORM
          </h2>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '25px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '30px 50px' }}>
          {[
            { label: 'Name', type: 'text', key: 'name' },
            { label: 'Program', type: 'select', key: 'program', options: programs },
            { label: 'Section', type: 'text', key: 'section', placeholder: 'e.g., 2-4' },
            { label: 'Labroom Requested', type: 'select', key: 'labRoom', options: labRooms },
            { label: 'Purpose', type: 'select', key: 'purpose', options: purposes },
            { label: 'Date Requested', type: 'text', key: 'dateRequested', readOnly: true },
            { label: 'Time Requested', type: 'select', key: 'timeRequested', options: times }
          ].map((field) => (
            <div key={field.key} style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>
                {field.label} <span style={{ color: '#dc2626' }}>*</span>
              </label>

              {field.type === 'select' ? (
                <select
                  value={eventForm[field.key]}
                  onChange={(e) => setEventForm({ ...eventForm, [field.key]: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={eventForm[field.key]}
                  readOnly={field.readOnly}
                  onChange={(e) => setEventForm({ ...eventForm, [field.key]: e.target.value })}
                  style={field.readOnly ? { ...inputStyle, cursor: 'not-allowed', color: '#666' } : inputStyle}
                />
              )}
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => onSubmit(eventForm)}
              disabled={!eventForm.name || !eventForm.labRoom || !eventForm.dateRequested}
              style={{
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
                opacity: (eventForm.name && eventForm.labRoom && eventForm.dateRequested) ? 1 : 0.5,
              }}
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
