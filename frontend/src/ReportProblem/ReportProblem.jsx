import React, { useState } from 'react';
import './ReportProblem.css';

const ReportProblem = ({ isOpen, onClose }) => {
  console.log('ReportProblem rendered - isOpen:', isOpen);
  
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MAX_CHARS = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!description.trim()) {
      setMessage({ type: 'error', text: 'Please describe the problem' });
      return;
    }

    if (description.length > MAX_CHARS) {
      setMessage({ type: 'error', text: `Description is too long (max ${MAX_CHARS} characters)` });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await fetch('http://localhost:9090/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: parseInt(userId), 
          report: description.trim() 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit report');
      }

      setSubmitted(true);
      setDescription(''); // Clear the form after successful submission
    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to submit report. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    setMessage({ type: '', text: '' });
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) {
    console.log('ReportProblem returning null because isOpen is false');
    return null;
  }

  console.log('ReportProblem should be visible now!');

  return (
    <div className="report-overlay" onClick={handleClose}>
      <div className="report-container" onClick={(e) => e.stopPropagation()}>
        <button className="report-close" onClick={handleClose}>×</button>

        {submitted ? (
          <div className="report-success-container">
            <div className="report-success-icon">✅</div>
            <div className="report-success-title">Report Submitted!</div>
            <div className="report-success-message">
              Thank you for your feedback. We'll review your report and take appropriate action.
            </div>
            <button className="report-success-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="report-header">
              <div className="report-title">Make a Report</div>
              <div className="report-subtitle">
                Let us know what issue you're experiencing
              </div>
            </div>

            {message.text && (
              <div className={`report-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <form className="report-form" onSubmit={handleSubmit}>
              <div className="report-form-group">
                <label className="report-label">Provide a description below</label>
                <textarea
                  className="report-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the issue you're experiencing in detail..."
                  disabled={loading}
                  maxLength={MAX_CHARS}
                />
                <div className={`report-char-counter ${description.length >= MAX_CHARS ? 'warning' : ''}`}>
                  {description.length}/{MAX_CHARS} characters
                </div>
              </div>

              <button
                type="submit"
                className="report-submit-btn"
                disabled={loading || !description.trim()}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};


export default ReportProblem;
