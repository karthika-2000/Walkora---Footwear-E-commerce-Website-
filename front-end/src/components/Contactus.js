import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingNavbar from './LandingNavbar';

const ContactUs = () => {
  return (
    <div>
      <LandingNavbar />

      <div
        className="container-fluid d-flex flex-column justify-content-center align-items-center text-white"
        style={{
          backgroundColor: '#f5e9dc',
          minHeight: '100vh',
          paddingTop: '20px',
          paddingBottom: '40px'
        }}
      >
        <h1
          className="fw-bold mb-2 mt-1"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '3.5rem',
            color: 'black'
          }}
        >
          Contact Us
        </h1>
        <p className="text-center text-dark mb-4">
          Have questions? We'd love to hear from you.
        </p>

        <div className="col-11 col-md-6 col-lg-5 bg-white text-dark rounded-4 shadow-sm p-4">
          <form>
            <div className="mb-3">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="Your name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control rounded-3"
                placeholder="Your email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Message</label>
              <textarea
                rows="3"
                className="form-control rounded-3"
                placeholder="Your message"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn px-4 fw-semibold text-white rounded-pill"
                style={{
                  background: 'linear-gradient(to right, #ff8008, #ffc837)',
                  border: 'none'
                }}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-4 small" style={{ color: 'black' }}>
          <p className="mb-1">+91 98765 43210</p>
          <p className="mb-1"> support@walkora.com</p>
          <p>123 Walkora Street, Chennai, India</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
