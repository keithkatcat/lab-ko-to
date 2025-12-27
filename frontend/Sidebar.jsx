import React from 'react';
import './Sidebar.css';

export function Sidebar({
  currentTime,
  availableRooms,
  selectedDate,
  events,
  previousBookings,
  onApprove,
  onRemove
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-title">CURRENT DATE</div>
        <div style={{
          fontSize: '24px',
          fontWeight: '900',
          color: '#C73A4A',
          lineHeight: '1',
          marginTop: '5px'
        }}>
          {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
        </div>

        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#C73A4A',
          marginTop: '2px',
          opacity: 0.9
        }}>
          {currentTime.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>

        <div style={{
          fontSize: '13px',
          fontWeight: '700',
          color: '#880015',
          marginTop: '8px',
          opacity: 0.7
        }}>
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </div>

      <div className="sidebar-section" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="sidebar-section-title">
          AVAILABLE ROOMS
          {selectedDate && (
            <span style={{ fontSize: '11px', fontWeight: 'normal', display: 'block' }}>
              ({selectedDate})
            </span>
          )}
        </div>

        {!selectedDate ? (
          <div style={{ fontSize: '12px', color: '#8d4b3e', opacity: 0.7, marginTop: '10px' }}>
            Select a date
          </div>
        ) : (
          <div style={{ marginTop: '12px' }}>
            {availableRooms.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {availableRooms.map((room) => (
                  <div key={room} style={{
                    background: '#F4EFEA',
                    padding: '6px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    fontWeight: '800',
                    color: '#C73A4A',
                    fontSize: '12px'
                  }}>{room}</div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#d85c5c', fontSize: '12px', fontWeight: 'bold' }}>
                No rooms available
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sidebar-section" style={{ maxHeight: '45%', overflowY: 'auto' }}>
        <div className="sidebar-section-title">BOOKING</div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ color: '#C73A4A', fontWeight: '900', fontSize: '16px', marginBottom: '6px' }}>
            Pending Request
          </div>
          {Object.entries(events).map(([date, dateEvents]) =>
            dateEvents.map((event, idx) => (
              <div key={`${date}-${idx}`} style={{
                background: 'white',
                padding: '8px',
                borderRadius: '12px',
                marginBottom: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontWeight: 'bold', color: '#8b1538', fontSize: '11px' }}>
                  {event.details.labRoom}
                </div>
                <div style={{ fontSize: '10px', color: '#555' }}>
                  {event.details.name}
                </div>
                <div style={{ fontSize: '9px', color: '#999', marginBottom: '4px' }}>
                  {date} • {event.time}
                </div>

                <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onApprove(date, idx)}
                    style={{
                      border: 'none',
                      background: '#22c55e',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >✓</button>
                  <button
                    onClick={() => onRemove(date, idx)}
                    style={{
                      border: 'none',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >✕</button>
                </div>
              </div>
            ))
          )}
          {Object.keys(events).length === 0 && (
            <div style={{ fontSize: '11px', color: '#2B0B10', opacity: 0.6 }}>
              No pending requests
            </div>
          )}
        </div>

        <div>
          <div style={{ color: '#C73A4A', fontWeight: '900', fontSize: '16px', marginBottom: '6px' }}>
            Previous Bookings
          </div>
          {previousBookings.map((booking, idx) => (
            <div key={idx} style={{
              background: '#F4EFEA',
              padding: '8px',
              borderRadius: '12px',
              marginBottom: '4px',
              fontSize: '10px'
            }}>
              <div style={{ fontWeight: 'bold', color: '#333' }}>
                {booking.details.labRoom}
              </div>
              <div style={{ color: '#f70000ff' }}>
                {booking.details.name}
              </div>
              <div style={{ color: '#ffa600ff' }}>
                {booking.date}
              </div>
            </div>
          ))}
          {previousBookings.length === 0 && (
            <div style={{ fontSize: '11px', color: '#2B0B10', opacity: 0.6 }}>
              No history
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;