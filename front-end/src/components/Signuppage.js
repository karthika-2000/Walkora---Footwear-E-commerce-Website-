import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  function registerUser(e) {
    e.preventDefault();  

    const user = {
      username: username,   
      email: email,
      mobile: mobile,
      address: address,
      password: password,
      confirmPassword: confirmPassword
    };

    axios.post('http://localhost:5000/api/signupapi', user)
      .then(response => {
        setErrorMessage('');
        navigate('/login');  
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Failed to connect to API');
        }
      });
  }

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-start pt-4" style={{
      background: 'linear-gradient(to right, #ffe259, #ffa751)'
    }}>

      <div className="w-100 text-start mt-3 px-4">
        <a href="/" className="text-black text-decoration-none fw-semibold">&larr; Back to Home</a>
      </div>

      <div className="row bg-white shadow rounded-5 overflow-hidden w-100 mt-3" style={{ maxWidth: '1000px', height: '600px' }}>

        <div className="col-md-6 p-4 d-flex flex-column justify-content-start slide-in-top-left">
          <div>
            <h4 className="fw-bold">Welcome to Walkora</h4>
            <p className="text-muted small mb-4">Please create your account</p>

            {errorMessage && (
  <div
    className="alert alert-danger py-1 px-2 small"
    style={{ fontSize: '0.85rem', borderRadius: '10px' }}
  >
    {errorMessage}
  </div>
)}

            <form className="mt-2" onSubmit={registerUser}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Email id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Contact Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-lg rounded-pill text-white fw-semibold" style={{
                  background: 'linear-gradient(to right, #ff8008, #ffc837)'
                }}>
                  Signup
                </button>
              </div>
            </form>

            <p className="text-center text-muted small mt-3">
              Already a member?{' '}
              <a href="/login" className="fw-semibold text-decoration-none" style={{
                background: 'linear-gradient(to right, #ff8008, #ffc837)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Login</a>
            </p>
          </div>
        </div>

        <div className="col-md-6 p-0">
          <img
            src="/images/whitemodelshoe.avif"
            alt="signuppage"
            className="img-fluid w-100 h-100 object-fit-cover rotating-image"
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
