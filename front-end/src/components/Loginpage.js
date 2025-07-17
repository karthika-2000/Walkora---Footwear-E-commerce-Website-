import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function attemptLogin(e) {
    e.preventDefault();

    axios
      .post('http://localhost:5000/api/loginapi', {
        email: email,
        password: password,
      })
     .then((response) => {
  setErrorMessage('');

  const token = response.data.token;
const user = response.data.user;

console.log("Token received:", token);
console.log("UserId received:", user._id);

localStorage.setItem('token', token);
localStorage.setItem('userId', user._id);

dispatch(login(token));
navigate('/allproducts');


})

      .catch((error) => {
        if (error.response?.data?.errors) {
          setErrorMessage(Object.values(error.response.data.errors).join(' '));
        } else if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Failed to login user. Please contact admin');
        }
      });
  }

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-start pt-4" style={{
      background: 'linear-gradient(to right, #ffe259, #ffa751)'
    }}>
      <div className="w-100 text-start mt-3 px-4">
        <a href="/" className="text-black text-decoration-none fw-semibold">
          &larr; Back to Home
        </a>
      </div>

      <div className="row bg-white shadow rounded-5 overflow-hidden w-100 mt-3 mx-auto" style={{ maxWidth: '810px', minHeight: '600px' }}>
        <div className="col-md-6 p-0">
          <img src="/images/Untitled design.png" alt="loginpage" className="img-fluid w-100 h-100 object-fit-cover rotating-image" />
        </div>

        <div className="col-md-6 p-5 d-flex flex-column justify-content-start slide-in-top-right">
          <div className="w-100 d-flex justify-content-center mb-4">
            <img src="/images/Logo.png" alt="Walkora Logo" className="img-fluid" style={{ height: '100px', maxWidth: '150px' }} />
          </div>

          <div>
            <h4 className="fw-bold">Welcome Back</h4>
            <p className="text-muted small mb-4">Please login to your account</p>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form className="mt-2" onSubmit={attemptLogin}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Email address"
                  value={email}
                  onInput={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control form-control-lg rounded-pill"
                  placeholder="Password"
                  value={password}
                  onInput={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-lg rounded-pill text-white fw-semibold" style={{
                  background: 'linear-gradient(to right, #ff8008, #ffc837)'
                }}>
                  Login
                </button>
              </div>
            </form>

            <p className="text-center text-muted small mt-3">
              New to <span className="fw-semibold">Walkora</span>?{' '}
              <a href="/signup" className="fw-semibold text-decoration-none" style={{
                background: 'linear-gradient(to right, #ff8008, #ffc837)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
