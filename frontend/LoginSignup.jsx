import React, { useState } from 'react';
import './LoginSignup.css';
import pylonImage from '../assets/pylonn.png';

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted');
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log('Signup submitted');
  };

  const switchToSignup = (e) => {
    e.preventDefault();
    setIsSignup(true);
  };

  const switchToLogin = (e) => {
    e.preventDefault();
    setIsSignup(false);
  };

  return (
    <div className="page-wrapper">

      {/* Title
      <div className="page-title">
        <h1>Lab Ko 'To</h1>
        <p>PUP CCIS Online Laboratory Scheduling System</p>
      </div> */}

      {/* Left Side - Pylon Image */}
      <div className="image-section">
        <img src={pylonImage} alt="PUP Pylon" />

      </div>

      {/* Right Side - Form Container */}
      <div className="form-section">
        <div className={`container ${isSignup ? 'active' : ''}`}>
          
          <div className="curved-shape"></div>
          <div className="curved-shape1"></div>

          {/* LOGIN FORM */}
          <div className="form-box Login">
            <h2 className="animation" style={{ '--D': 0 }}>Welcome Back</h2>

            <form onSubmit={handleLoginSubmit}>
              <div className="input-box animation" style={{ '--D': 1 }}>
                <input type="email" className="input" required />
                <label>Email</label>
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div className="input-box animation" style={{ '--D': 2 }}>
                <input type="password" className="input" required />
                <label>Password</label>
                <i className="fa-solid fa-key"></i>
              </div>

              <div className="input-box animation" style={{ '--D': 3 }}>
                <button type="submit" className="btn">Login</button>
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

          <div className="info-content Login">
            <h2 className="animation" style={{ '--D': 0 }}>Lab Natin 'To!</h2>
            <p className="animation" style={{ '--D': 1 }}>
              Jump right back in! Schedule your laboratory sessions with ease.
            </p>
          </div>

          {/* SIGNUP FORM */}
          <div className="form-box Signup">
            <h2 className="animation" style={{ '--D': 0 }}>Get Started</h2>

            <form onSubmit={handleSignupSubmit}>
              <div className="input-box animation" style={{ '--D': 1 }}>
                <input type="email" className="input" required />
                <label>Email</label>
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div className="input-box animation" style={{ '--D': 2 }}>
                <input type="password" className="input" required />
                <label>Password</label>
                <i className="fa-solid fa-key"></i>
              </div>

              <div className="input-box animation" style={{ '--D': 3 }}>
                <button type="submit" className="btn">Sign Up</button>
              </div>

              <div className="regi-link animation" style={{ '--D': 4 }}>
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
      </div>
    </div>
  );
};

export default LoginSignup;