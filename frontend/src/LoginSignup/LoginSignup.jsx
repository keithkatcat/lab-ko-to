import React, {useState} from 'react';
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
    password: '' 
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
      
      console.log('Login response data:', data); // Debug: see what we get back
      
      if (response.ok && data.token) {
        const token = data.token;
        console.log('Token received:', token); // Debug: verify token exists
        
        // Get user details to extract user ID and role
        const userResponse = await fetch('http://localhost:9090/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          console.log('User data received:', userData); // Debug log
          
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
          
          console.log('Login successful!', userData);
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
    
    try {
      const response = await fetch('http://localhost:9090/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          accountType: selectedRole === 'user' ? 'student' : 'admin'
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
            <h2>I am a...</h2>
            <div className="role-buttons">
              <button 
                className="role-btn user-btn" 
                onClick={() => handleRoleSelect('user')}
              >
                <i className="fa-solid fa-users"></i>
                <span>Student/Professor</span>
              </button>
              <button 
                className="role-btn admin-btn" 
                onClick={() => handleRoleSelect('admin')}
              >
                <i className="fa-solid fa-user-shield"></i>
                <span>Admin</span>
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
                    Don't have an account?{' '}
                    <a href="#" onClick={switchToSignup}>
                      Create One!
                    </a>
                  </p>
                </div>
              </form>
            </div>

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:9090/api/user/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: signupData.username,
                    email: signupData.email,
                    password: signupData.password,
                    accountType: selectedRole === 'student' ? 'student' : 'professor'
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
                <img src={pylonImage} alt="PUP Pylon"/>
            </div>

            <div className="form-section">
                {selectedRole === null ? (
                    <div className="role-selection-container">
                        <div className="title-section">
                            <h1>Lab Ko 'To</h1>
                            <p>PUP CCIS Online Laboratory Scheduling System</p>
                        </div>
                        <h2>I am a...</h2>
                        <div className="role-buttons">
                            <button
                                className="role-btn student-btn"
                                onClick={() => handleRoleSelect('student')}
                            >
                                <i className="fa-solid fa-user-graduate"></i>
                                <span>Student</span>
                            </button>
                            <button
                                className="role-btn faculty-btn"
                                onClick={() => handleRoleSelect('faculty')}
                            >
                                <i className="fa-solid fa-chalkboard-teacher"></i>
                                <span>Faculty</span>
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
                            <h2 className="animation" style={{'--D': 0}}>
                                Welcome Back!
                            </h2>

                            {errorMessage && !isSignup && (
                                <div className="error-message animation" style={{'--D': 0.5}}>
                                    {errorMessage}
                                </div>
                            )}

                            {successMessage && !isSignup && (
                                <div className="success-message animation" style={{'--D': 0.5}}>
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleLoginSubmit}>
                                <div className="input-box animation" style={{'--D': 1}}>
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

                                <div className="input-box animation" style={{'--D': 2}}>
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

                                <div className="input-box animation" style={{'--D': 3}}>
                                    <button type="submit" className="btn" disabled={isLoading}>
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>

                                <div className="regi-link animation" style={{'--D': 4}}>
                                    <p>
                                        Don't have an account?{' '}
                                        <a href="#" onClick={switchToSignup}>
                                            Create One!
                                        </a>
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="info-content Login">
                            <h2 className="animation" style={{'--D': 0}}>Lab Natin 'To!</h2>
                            <p className="animation" style={{'--D': 1}}>
                                Jump right back in! Schedule your laboratory sessions with ease.
                            </p>
                        </div>

                        {/* SIGNUP FORM */}
                        <div className="form-box Signup">
                            <h2 className="animation" style={{'--D': 0}}>
                                Get Started
                            </h2>

                            {errorMessage && isSignup && (
                                <div className="error-message animation" style={{'--D': 0.5}}>
                                    {errorMessage}
                                </div>
                            )}

                            {successMessage && (
                                <div className="success-message animation" style={{'--D': 0.5}}>
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleSignupSubmit}>
                                <div className="input-box animation" style={{'--D': 1}}>
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

                                <div className="input-box animation" style={{'--D': 2}}>
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

                                <div className="input-box animation" style={{'--D': 3}}>
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

                                <div className="input-box animation" style={{'--D': 4}}>
                                    <button type="submit" className="btn" disabled={isLoading}>
                                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                                    </button>
                                </div>

                                <div className="regi-link animation" style={{'--D': 5}}>
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
                            <h2 className="animation" style={{'--D': 0}}>Schedule Mo 'To!</h2>
                            <p className="animation" style={{'--D': 1}}>
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