import React, { useState } from 'react';
import './LoginSignup.css';
import pylonImage from '../assets/pylonn.png';

const LoginSignup = ({ onLoginSuccess }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    // Form data states
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        password: '',
        accountType: 'student' // Default
    });

    // UI states
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:9090/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                const token = data.token;
                console.log('Token received:', token.substring(0, 20) + '...');

                // Get user details to extract user ID and role
                const userResponse = await fetch('http://localhost:9090/api/user/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('User response status:', userResponse.status);

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    console.log('User data received:', userData);

                    // Admin verification check
                    if (selectedRole === 'admin' && userData.accountType !== 'admin') {
                        setErrorMessage('Access denied. Admin privileges required.');
                        return;
                    }

                    // Student/Professor verification check
                    if (selectedRole === 'user' && userData.accountType === 'admin') {
                        setErrorMessage('Please use the Admin login option.');
                        return;
                    }

                    // Store everything we need
                    localStorage.setItem('token', token);
                    localStorage.setItem('userId', userData.id);
                    localStorage.setItem('userRole', userData.accountType);
                    localStorage.setItem('userName', userData.username);
                    localStorage.setItem('userEmail', userData.email);

                    setSuccessMessage('Login successful! Redirecting...');

                    // Call the onLoginSuccess callback after 1 second
                    setTimeout(() => {
                        if (onLoginSuccess) {
                            onLoginSuccess(userData.accountType);
                        }
                    }, 1000);
                } else {
                    const errorData = await userResponse.json().catch(() => ({}));
                    console.error('Failed to fetch user data:', userResponse.status, errorData);
                    setErrorMessage(`Failed to retrieve user information. Status: ${userResponse.status}`);
                }
            } else {
                setErrorMessage(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setErrorMessage('Unable to connect to server. Please try again later.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        // Don't allow admin signup
        if (selectedRole === 'admin') {
            setErrorMessage('Admin accounts cannot be created through signup. Contact system administrator.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:9090/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: signupData.username,
                    email: signupData.email,
                    password: signupData.password,
                    accountType: signupData.accountType
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Account created successfully! Please login.');
                console.log('Signup successful!', data);
                setTimeout(() => {
                    setIsSignup(false);
                    setSuccessMessage('');
                }, 2000);
            } else {
                setErrorMessage(data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Unable to connect to server. Please try again later.');
            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const switchToSignup = (e) => {
        e.preventDefault();
        setIsSignup(true);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const switchToLogin = (e) => {
        e.preventDefault();
        setIsSignup(false);
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const goBackToRoleSelect = () => {
        setSelectedRole(null);
        setIsSignup(false);
        setErrorMessage('');
        setSuccessMessage('');
    };

    return (
        <div className="page-wrapper">
            <div className="image-section">
                <img src={pylonImage} alt="PUP Pylon" />
            </div>

            <div className="form-section">
                {selectedRole === null ? (
                    <div className="role-selection-container">
                        <div className="title-section">
                            <h1>Lab Ko 'To</h1>
                            <p>PUP CCIS Online Laboratory Scheduling System</p>
                        </div>
                        <h2>Sign in as</h2>
                        <div className="role-buttons">
                            <button
                                className="role-btn user-btn"
                                onClick={() => handleRoleSelect('user')}
                            >
                                <i className="fa-solid fa-users"></i>
                                <span>User</span>
                                <small style={{fontSize: '11px', marginTop: '5px', color: '#666', display: 'block'}}>
                                    Student / Faculty
                                </small>
                            </button>
                            <button
                                className="role-btn admin-btn"
                                onClick={() => handleRoleSelect('admin')}
                            >
                                <i className="fa-solid fa-user-shield"></i>
                                <span>Admin</span>
                                <small style={{fontSize: '11px', marginTop: '5px', color: '#666', display: 'block'}}>
                                    Administrator
                                </small>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`login-container ${isSignup ? 'active' : ''}`}>

                        <button className="back-to-role" onClick={goBackToRoleSelect}>
                            <i className="fa-solid fa-arrow-left"></i> Change Role
                        </button>

                        <div className="curved-shape"></div>
                        <div className="curved-shape1"></div>

                        {/* LOGIN FORM */}
                        <div className="form-box Login">
                            <h2 className="animation" style={{ '--D': 0 }}>
                                Welcome Back!
                            </h2>

                            {errorMessage && !isSignup && (
                                <div className="error-message animation" style={{ '--D': 0.5 }}>
                                    {errorMessage}
                                </div>
                            )}

                            {successMessage && !isSignup && (
                                <div className="success-message animation" style={{ '--D': 0.5 }}>
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleLoginSubmit}>
                                <div className="input-box animation" style={{ '--D': 1 }}>
                                    <input
                                        type="email"
                                        className="input"
                                        required
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                        disabled={isLoading}
                                    />
                                    <label>Email</label>
                                    <i className="fa-solid fa-envelope"></i>
                                </div>

                                <div className="input-box animation" style={{ '--D': 2 }}>
                                    <input
                                        type="password"
                                        className="input"
                                        required
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                        disabled={isLoading}
                                    />
                                    <label>Password</label>
                                    <i className="fa-solid fa-key"></i>
                                </div>

                                <div className="input-box animation" style={{ '--D': 3 }}>
                                    <button type="submit" className="btn" disabled={isLoading}>
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>

                                <div className="regi-link animation" style={{ '--D': 4 }}>
                                    <p>
                                        {selectedRole === 'admin' ? (
                                            'Contact administrator for admin access'
                                        ) : (
                                            <>
                                                Don't have an account?{' '}
                                                <a href="#" onClick={switchToSignup}>
                                                    Create One!
                                                </a>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="info-content Login">
                            <h2 className="animation" style={{ '--D': 0 }}>Lab Natin 'To!</h2>
                            <p className="animation" style={{ '--D': 1 }}>
                                Jump right back in! Schedule your laboratory sessions with ease.
                            </p>
                        </div>

                        {/* SIGNUP FORM */}
                        <div className="form-box Signup">
                            <h2 className="animation" style={{ '--D': 0 }}>
                                Get Started
                            </h2>

                            {errorMessage && isSignup && (
                                <div className="error-message animation" style={{ '--D': 0.5 }}>
                                    {errorMessage}
                                </div>
                            )}

                            {successMessage && isSignup && (
                                <div className="success-message animation" style={{ '--D': 0.5 }}>
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleSignupSubmit}>
                                {/* Account Type Selection for User role */}
                                {selectedRole === 'user' && (
                                    <div className="input-box animation" style={{ '--D': 1 }}>
                                        <select
                                            className="input"
                                            required
                                            value={signupData.accountType}
                                            onChange={(e) => setSignupData({...signupData, accountType: e.target.value})}
                                            disabled={isLoading}
                                            style={{
                                                width: '100%',
                                                background: 'transparent',
                                                border: 'none',
                                                borderBottom: '2px solid #000000',
                                                color: '#000000',
                                                fontWeight: '600',
                                                fontSize: '16px',
                                                padding: '10px 0',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="student">Student</option>
                                            <option value="professor">Professor</option>
                                        </select>
                                        <label style={{top: '-10px', fontSize: '12px', color: '#8B0000'}}>
                                            Account Type
                                        </label>
                                        <i className="fa-solid fa-user-tag"></i>
                                    </div>
                                )}

                                <div className="input-box animation" style={{ '--D': 2 }}>
                                    <input
                                        type="text"
                                        className="input"
                                        required
                                        value={signupData.username}
                                        onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                                        disabled={isLoading}
                                    />
                                    <label>Username</label>
                                    <i className="fa-solid fa-user"></i>
                                </div>

                                <div className="input-box animation" style={{ '--D': 3 }}>
                                    <input
                                        type="email"
                                        className="input"
                                        required
                                        value={signupData.email}
                                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                        disabled={isLoading}
                                    />
                                    <label>Email</label>
                                    <i className="fa-solid fa-envelope"></i>
                                </div>

                                <div className="input-box animation" style={{ '--D': 4 }}>
                                    <input
                                        type="password"
                                        className="input"
                                        required
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                                        disabled={isLoading}
                                    />
                                    <label>Password</label>
                                    <i className="fa-solid fa-key"></i>
                                </div>

                                <div className="input-box animation" style={{ '--D': 5 }}>
                                    <button type="submit" className="btn" disabled={isLoading}>
                                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                                    </button>
                                </div>

                                <div className="regi-link animation" style={{ '--D': 6 }}>
                                    <p>
                                        Already have an account?{' '}
                                        <a href="#" onClick={switchToLogin}>
                                            Login!
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="info-content Signup">
                            <h2 className="animation" style={{ '--D': 0 }}>Schedule Mo 'To!</h2>
                            <p className="animation" style={{ '--D': 1 }}>
                                Create an account to start scheduling your laboratory sessions.
                            </p>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginSignup;