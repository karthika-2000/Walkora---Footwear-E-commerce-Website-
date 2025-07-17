import React from 'react';
import '../App.css';
import LandingNavbar from './LandingNavbar';

const AboutUs = () => {
  return (
    <div>
      <LandingNavbar />

      <div
        className="container-fluid py-5"
        style={{ background: 'linear-gradient(to right, #ffcc70, #ff8008)' }}
      >
        <h1 className="text-center fw-bold mb-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: '5.5rem', color: '#fff' }}>
          About Us
        </h1>

    
        <div className="row align-items-center mb-5 px-4">
          <div className="col-md-6">
            <h2 className="fw-bold text-dark d-flex align-items-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem' }}>
              <i className="bi bi-arrow-right-circle-fill text-dark me-3 fs-1"></i>
              Our Mission
            </h2>
            <p className="fs-5 text-light">
              At Walkora, our mission is to empower everyone to walk in style and comfort.
              We blend fashion and functionality to bring footwear collections that
              celebrate individuality, elegance, and confidence for all ages.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="images/ourmission.jpg"
              alt="Mission"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>

        
        <div className="row align-items-center mb-5 px-4 flex-md-row-reverse">
  <div className="col-md-6 text-md-end">
    <h2 className="fw-bold text-dark d-flex align-items-center justify-content-md-end text-md-end" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem' }}>
      Our Story
      <i className="bi bi-arrow-left-circle-fill text-dark ms-3 fs-1"></i>
    </h2>
    <p className="fs-5 text-light">
      Founded in 2023, Walkora started as a dream to redefine everyday footwear. From humble beginnings,
      we've grown into a brand trusted by thousands, committed to delivering quality and comfort without compromise.
    </p>
  </div>
  <div className="col-md-6">
    <img
      src="images/ourstory.avif"
      alt="Story"
      className="img-fluid rounded shadow"
    />
  </div>
</div>

    
        <div className="row align-items-center mb-5 px-4">
          <div className="col-md-6">
            <h2 className="fw-bold text-dark d-flex align-items-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem' }}>
              <i className="bi bi-arrow-right-circle-fill text-dark me-3 fs-1"></i>
              Why Choose Us
            </h2>
            <p className="fs-5 text-light">
              We prioritize customer satisfaction, trend-forward designs, and sustainable practices. 
              Whether it’s for a casual walk or a special occasion, we ensure every step you take is a confident one.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="images/whychooseus.jpg"
              alt="Why Choose Us"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
