import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('All fields are required');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/profile/changepassword',
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <>
      <Navbar />

       
      <div className="text-white py-5" style={{
        backgroundImage: "url('images/orange-sandals-with-flowers-orange-background_653240-61363.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="container">
          <h2 className="display-5 fw-bold">Change Password</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 mt-3">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/userprofile" className="text-white text-decoration-none">My Account</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/changepassword" className="text-white text-decoration-none">Change Password</Link>
              </li>
            </ol>
          </nav>
        </div>
      </div>



      <div className="container mt-5">
        <h3>Change Password</h3>
        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleChangePassword} className="mt-4" style={{ maxWidth: '400px' }}>
          <div className="mb-3">
            <label>Current Password</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
               <button
    className="btn w-100 text-white"
    style={{ background: "linear-gradient(to right, #ff8008, #ffc837)" }}
  >
    Change Password
  </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
