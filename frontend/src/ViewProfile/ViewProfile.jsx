import React, { useState, useEffect, useRef } from 'react';
import './ViewProfile.css';

const ViewProfile = ({ isOpen, onClose, onProfileUpdate }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({ 
    firstName: '', 
    lastName: '', 
    middleInitial: '', 
    year: '', 
    section: '', 
    academicYear: '', 
    program: '', 
    profilePicture: '' 
  });
  const [reservationHistory, setReservationHistory] = useState([]);
  const fileInputRef = useRef(null);

  const getToken = () => localStorage.getItem('token');
  const getUserId = () => localStorage.getItem('userId');

  const parseFullName = (name) => {
    if (!name) return { firstName: '', lastName: '', middleInitial: '' };
    const p = name.trim().split(' ');
    return p.length === 1 ? { firstName: p[0], lastName: '', middleInitial: '' } : p.length === 2 ? { firstName: p[0], lastName: p[1], middleInitial: '' } : { firstName: p[0], lastName: p[p.length - 1], middleInitial: p[1].charAt(0).toUpperCase() };
  };

  const combineFullName = (f, l, m) => [f, m ? m + '.' : '', l].filter(Boolean).join(' ');
  const combineYearSection = (y, s) => !y ? '' : s ? `${y} - ${s}` : `${y}`;
  const formatAY = (ay) => ay ? `${ay}-${parseInt(ay) + 1}` : '';

  const getLocalData = (userId) => ({ 
    year: localStorage.getItem(`user_${userId}_year`) || '', 
    section: localStorage.getItem(`user_${userId}_section`) || '', 
    academicYear: localStorage.getItem(`user_${userId}_academicYear`) || '', 
    program: localStorage.getItem(`user_${userId}_program`) || '', 
    profilePicture: localStorage.getItem(`user_${userId}_profilePicture`) || '' 
  });

  const saveLocalData = (userId, data) => {
    Object.entries(data).forEach(([key, value]) => localStorage.setItem(`user_${userId}_${key}`, value));
  };

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getToken(), userId = getUserId();
        if (!token || !userId) throw new Error('No authentication token');
        const res = await fetch('http://localhost:9090/api/admin/users', { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to fetch');
        const users = await res.json(), user = users.find(u => u.id === parseInt(userId));
        if (!user) throw new Error('User not found');
        const local = getLocalData(userId);
        const userData = { ...user, ...local, yearLevel: combineYearSection(local.year, local.section), batch: formatAY(local.academicYear) };
        setUserData(userData);
        setEditedData({ ...parseFullName(user.fullName || user.username), ...local });
      } catch (err) {
        console.error(err);
        const userId = getUserId() || '1', local = { year: '3', section: '1', academicYear: '2024', program: 'BSCS', profilePicture: '', ...getLocalData(userId) };
        const mock = { fullName: 'Fname Lname', email: 'user@example.com', accountType: 'Student', ...local, yearLevel: combineYearSection(local.year, local.section), batch: formatAY(local.academicYear) };
        setUserData(mock);
        setEditedData({ ...parseFullName(mock.fullName), ...local });
      } finally { setLoading(false); }
    };
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchHistory = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No token');
        const res = await fetch('http://localhost:9090/api/reservations', { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed');
        setReservationHistory(await res.json());
      } catch (err) {
        console.error(err);
        setReservationHistory([
          { id: 1, labName: 'Computer Lab 1', status: 'approved', date: '2024-01-05', startTime: '10:00', endTime: '12:00' },
          { id: 2, labName: 'Physics Lab', status: 'pending', date: '2024-01-06', startTime: '14:00', endTime: '16:00' },
          { id: 3, labName: 'Computer Lab 1', status: 'rejected', date: '2024-01-05', startTime: '10:00', endTime: '12:00' },
          { id: 4, labName: 'Physics Lab', status: 'pending', date: '2024-01-06', startTime: '14:00', endTime: '16:00' }
        ]);
      }
    };
    fetchHistory();
  }, [isOpen]);

  const handleOpenEdit = () => {
    setEditedData({ 
      ...parseFullName(userData.fullName), 
      year: userData.year || '', 
      section: userData.section || '', 
      academicYear: userData.academicYear || '', 
      program: userData.program || '', 
      profilePicture: userData.profilePicture || '' 
    });
    setIsEditModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5242880) return alert('File size must be less than 5MB');
    if (!f.type.startsWith('image/')) return alert('Please upload an image file');
    const reader = new FileReader();
    reader.onloadend = () => setEditedData(prev => ({ ...prev, profilePicture: reader.result }));
    reader.readAsDataURL(f);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = getToken(), userId = getUserId();
      if (!token || !userId) throw new Error('No token');
      if (!editedData.firstName.trim() || !editedData.lastName.trim()) return alert('First and last name required');
      const fullName = combineFullName(editedData.firstName, editedData.lastName, editedData.middleInitial);
      saveLocalData(userId, editedData);
      const res = await fetch(`http://localhost:9090/api/user/${userId}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
        body: JSON.stringify({ fullName }) 
      });
      if (!res.ok) throw new Error('Failed to update');
      const updatedUser = await res.json();
      setUserData({ 
        ...updatedUser, 
        ...editedData, 
        yearLevel: combineYearSection(editedData.year, editedData.section), 
        batch: formatAY(editedData.academicYear) 
      });
      
      if (onProfileUpdate) {
        onProfileUpdate({ fullName });
      }
      
      setIsEditModalOpen(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      saveLocalData(getUserId(), editedData);
      const fullName = combineFullName(editedData.firstName, editedData.lastName, editedData.middleInitial);
      setUserData(prev => ({ 
        ...prev, 
        fullName, 
        ...editedData, 
        yearLevel: combineYearSection(editedData.year, editedData.section), 
        batch: formatAY(editedData.academicYear) 
      }));
      
      if (onProfileUpdate) {
        onProfileUpdate({ fullName });
      }
      
      setIsEditModalOpen(false);
      alert('Profile updated! (Local mode)');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="profile-overlay" onClick={onClose}>
        <div className="profile-container" onClick={(e) => e.stopPropagation()}>
          <button className="profile-close" onClick={onClose}>×</button>
          {loading ? <div className="profile-loading">Loading...</div> : (
            <>
              <div className="profile-picture-section">
                <div className="profile-picture">
                  <img src={userData?.profilePicture || 'https://i.postimg.cc/vMCvJGcj/userpx.png'} alt="Profile" />
                </div>
              </div>
              <div className="profile-info-section">
                <div className="profile-fullname">{userData?.fullName || 'No Name'}</div>
                <div className="profile-email">{userData?.email || 'No Email'}</div>
                <div className="profile-year">
                  {userData?.program && <span style={{ fontWeight: 'bold' }}>{userData.program}</span>}
                  {userData?.program && userData?.yearLevel && ' | '}
                  {userData?.yearLevel || 'No Year Level'}
                </div>
                <div className="profile-batch">A.Y.: {userData?.batch || 'No Academic Year'}</div>
                <div className="profile-year" style={{ marginTop: '10px', opacity: 0.7 }}>
                  Account Type: {userData?.accountType || 'N/A'}
                </div>
              </div>
              <div className="profile-edit-section">
                <button className="profile-edit-btn" onClick={handleOpenEdit}>Edit Profile</button>
              </div>
              <div className="profile-history-section">
                <div className="profile-history-title">Reservation History</div>
                <div className="profile-history-list">
                  {reservationHistory.length === 0 ? (
                    <div className="profile-history-empty">No reservation history</div>
                  ) : (
                    reservationHistory.map((r, i) => (
                      <div key={i} className="profile-history-item">
                        <div className="history-item-header">
                          <span className="history-lab-name">{r.labName || `Lab ${r.labId}`}</span>
                          <span className={`history-status ${r.status.toLowerCase()}`}>{r.status}</span>
                        </div>
                        <div className="history-item-details">
                          <span className="history-date">{r.date}</span>
                          <span className="history-time">{r.startTime?.substring(0, 5)} - {r.endTime?.substring(0, 5)}</span>
                        </div>
                        {r.adminNotes && (
                          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '5px', fontStyle: 'italic' }}>
                            Note: {r.adminNotes}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="profile-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="edit-profile-landscape" onClick={(e) => e.stopPropagation()}>
            <button className="profile-close" onClick={() => setIsEditModalOpen(false)}>×</button>
            <h2 className="edit-profile-title">Edit Profile</h2>
            <div className="edit-profile-content">
              <div className="edit-profile-left">
                <div className="edit-profile-picture-wrapper">
                  <img src={editedData.profilePicture || 'https://i.postimg.cc/vMCvJGcj/userpx.png'} alt="Profile" className="edit-profile-picture" />
                </div>
                <div className="edit-profile-picture-buttons">
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  <button onClick={() => fileInputRef.current.click()} className="upload-btn">Upload Photo</button>
                  {editedData.profilePicture && (
                    <button onClick={() => handleInputChange('profilePicture', '')} className="remove-btn">Remove Photo</button>
                  )}
                </div>
              </div>
              <div className="edit-profile-right">
                <div className="edit-form-grid">
                  <div className="form-group-firstname">
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input 
                        type="text"
                        value={editedData.firstName} 
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="form-input" 
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>
                  <div className="form-group-middle">
                    <div className="form-group">
                      <label className="form-label">Middle Initial</label>
                      <input 
                        type="text"
                        value={editedData.middleInitial} 
                        onChange={(e) => handleInputChange('middleInitial', e.target.value.toUpperCase())}
                        className="form-input" 
                        placeholder="M.I."
                        maxLength="1"
                      />
                    </div>
                  </div>
                  <div className="form-group-lastname">
                    <div className="form-group">
                      <label className="form-label">Last Name *</label>
                      <input 
                        type="text"
                        value={editedData.lastName} 
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="form-input" 
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="form-group-program">
                    <div className="form-group">
                      <label className="form-label">Program</label>
                      <select 
                        value={editedData.program} 
                        onChange={(e) => handleInputChange('program', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select Program</option>
                        <option value="BSCS">BSCS - Bachelor of Science in Computer Science</option>
                        <option value="BSIT">BSIT - Bachelor of Science in Information Technology</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group-year">
                    <div className="form-group">
                      <label className="form-label">Year</label>
                      <select 
                        value={editedData.year} 
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group-section">
                    <div className="form-group">
                      <label className="form-label">Section</label>
                      <select 
                        value={editedData.section} 
                        onChange={(e) => handleInputChange('section', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select Section</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="1N">1N</option>
                        <option value="2N">2N</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group-academic">
                    <div className="form-group">
                      <label className="form-label">Academic Year</label>
                      <select 
                        value={editedData.academicYear} 
                        onChange={(e) => handleInputChange('academicYear', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select A.Y.</option>
                        <option value="2025">2025-2026</option>
                        <option value="2026">2026-2027</option>
                        <option value="2027">2027-2028</option>
                        <option value="2028">2028-2029</option>
                        <option value="2029">2029-2030</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="edit-profile-actions">
                  <button className="save-btn" onClick={handleSave}>Save Changes</button>
                  <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewProfile;