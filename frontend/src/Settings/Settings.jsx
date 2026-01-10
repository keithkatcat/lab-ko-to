import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [passwordForEmail, setPasswordForEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const email = localStorage.getItem('userEmail');
            console.log('Loaded email from localStorage:', email);
            setCurrentEmail(email || '');

            // Reset all form fields
            setNewEmail('');
            setPasswordForEmail('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setMessage({ type: '', text: '' });
        }
    }, [isOpen]);

    const handleEmailChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (!newEmail || !passwordForEmail) {
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

            console.log('Sending email update request...');
            console.log('New email:', newEmail);

            const response = await fetch('http://localhost:9090/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: newEmail,
                    oldPassword: passwordForEmail
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to change email' }));
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to change email');
            }

            const data = await response.json();
            console.log('Email update successful:', data);

            // Update local state and storage
            setCurrentEmail(newEmail);
            localStorage.setItem('userEmail', newEmail);

            // Clear form
            setNewEmail('');
            setPasswordForEmail('');

            setMessage({ type: 'success', text: 'Email successfully updated!' });

            // Auto-close message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);

        } catch (error) {
            console.error('Error changing email:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to change email. Please check your password.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
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

        if (currentPassword === newPassword) {
            setMessage({ type: 'error', text: 'New password must be different from current password' });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            console.log('Sending password update request...');

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

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to change password' }));
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to change password');
            }

            console.log('Password update successful');

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setMessage({ type: 'success', text: 'Password successfully updated!' });

            // Auto-close message after 3 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);

        } catch (error) {
            console.error('Error changing password:', error);
            setMessage({
                type: 'error',
                text: error.message || 'Failed to change password. Please check your current password.'
            });
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
            console.log('Deletion request submitted:', deleteReason);

            setMessage({
                type: 'success',
                text: 'Deletion request submitted. An admin will review your request.'
            });
            setShowDeleteConfirm(false);
            setDeleteReason('');

            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
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

                    {/* Change Email Section */}
                    <div className="settings-section">
                        <div className="settings-section-title">Change Email</div>
                        <div className="settings-current-email">
                            Current: {currentEmail || 'Loading...'}
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
                                    autoComplete="email"
                                />
                            </div>
                            <div className="settings-form-group">
                                <label className="settings-label">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForEmail}
                                    onChange={(e) => setPasswordForEmail(e.target.value)}
                                    className="settings-input"
                                    placeholder="Enter password to confirm"
                                    disabled={loading}
                                    autoComplete="current-password"
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

                    {/* Change Password Section */}
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
                                    autoComplete="current-password"
                                />
                            </div>
                            <div className="settings-form-group">
                                <label className="settings-label">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="settings-input"
                                    placeholder="Enter new password (min 6 characters)"
                                    disabled={loading}
                                    autoComplete="new-password"
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
                                    autoComplete="new-password"
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

                    {/* Account Deletion Section */}
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

            {/* Deletion Confirmation Dialog */}
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
                  rows="4"
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