import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (email) {
          setCurrentEmail(email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
        setMessage({ type: 'error', text: 'Failed to load user data' });
      }
    };

    if (isOpen) {
      fetchUserData();
      setNewEmail('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: '', text: '' });
    }
  }, [isOpen]);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!newEmail || !currentPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (newEmail === currentEmail) {
      setMessage({ type: 'error', text: 'New email is the same as current email' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:9090/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newEmail,
          oldPassword: currentPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change email');
      }

      await response.json(); // Consume the response
      
      setCurrentEmail(newEmail);
      localStorage.setItem('userEmail', newEmail);
      setNewEmail('');
      setCurrentPassword('');
      setMessage({ type: 'success', text: 'Email successfully updated!' });
    } catch (error) {
      console.error('Error changing email:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to change email. Please check your password.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:9090/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword: newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Password successfully updated!' });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to change password. Please check your current password.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!deleteReason.trim()) {
      setMessage({ type: 'error', text: 'Please provide a reason for account deletion' });
      return;
    }

    setLoading(true);
    try {
      setMessage({ type: 'success', text: 'Deletion request submitted. An admin will review your request.' });
      setShowDeleteConfirm(false);
      setDeleteReason('');
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      setMessage({ type: 'error', text: 'Failed to submit deletion request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="settings-overlay" onClick={onClose}>
        <div className="settings-container" onClick={(e) => e.stopPropagation()}>
          <button className="settings-close" onClick={onClose}>×</button>
          
          <div className="settings-header">
            <div className="settings-title">Settings</div>
            <div className="settings-subtitle">Manage your account preferences</div>
          </div>

          {message.text && (
            <div className={`settings-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="settings-section">
            <div className="settings-section-title">Change Email</div>
            <div className="settings-current-email">
              Current: {currentEmail}
            </div>
            <form onSubmit={handleEmailChange}>
              <div className="settings-form-group">
                <label className="settings-label">New Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="settings-input"
                  placeholder="Enter new email"
                  disabled={loading}
                />
              </div>
              <div className="settings-form-group">
                <label className="settings-label">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="settings-input"
                  placeholder="Enter password to confirm"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="settings-button settings-save-btn"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Email'}
              </button>
            </form>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">Change Password</div>
            <form onSubmit={handlePasswordChange}>
              <div className="settings-form-group">
                <label className="settings-label">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="settings-input"
                  placeholder="Enter current password"
                  disabled={loading}
                />
              </div>
              <div className="settings-form-group">
                <label className="settings-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="settings-input"
                  placeholder="Enter new password"
                  disabled={loading}
                />
              </div>
              <div className="settings-form-group">
                <label className="settings-label">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="settings-input"
                  placeholder="Confirm new password"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="settings-button settings-save-btn"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="settings-section">
            <div className="settings-danger-zone">
              <div className="settings-danger-title">Request Account Deletion</div>
              <div className="settings-danger-description">
                Submit a request to delete your account. An administrator will review and process your request.
              </div>
              <button
                className="settings-button settings-delete-btn"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
              >
                Request Account Deletion
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="settings-confirm-overlay">
          <div className="settings-confirm-dialog">
            <div className="settings-confirm-title">⚠️ Request Account Deletion?</div>
            <div className="settings-confirm-message">
              Your request will be sent to an administrator for review.
              Please provide a reason for deletion.
            </div>
            <div className="settings-form-group">
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="settings-input"
                placeholder="Please tell us why you want to delete your account..."
                disabled={loading}
              />
            </div>
            <div className="settings-confirm-buttons">
              <button
                className="settings-cancel-btn"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteReason('');
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="settings-confirm-btn"
                onClick={handleRequestDeletion}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;