import axios from "axios";
import React, { useState, useEffect } from "react";
import './App.css';
import { Link } from "react-router-dom";
import LandingNavbar from './components/LandingNavbar';

function App() {

  const [showSearch, setShowSearch] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [genderProducts, setGenderProducts] = useState([]);

  useEffect(() => {
    fetchCategoryProducts();
    fetchGenderProducts();
  }, []);

  const fetchCategoryProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cat/categories/landing');
      setCategoryProducts(res.data);
    } catch (err) {
      console.error("Error fetching category products", err);
    }
  };

  const fetchGenderProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trending/landing');
      setGenderProducts(res.data);
    } catch (err) {
      console.error("Error fetching gender products", err);
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div className="bg-image text-dark" style={{
        backgroundImage: "url('images/high-heel-pink-high-heeled-shoes-beige-with-pink-flowers-orange-background_118124-136984.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh'
      }}>
        <LandingNavbar />

        <div className="container-fluid px-5" style={{ backgroundColor: '#f5e9dc', marginBottom: '-2rem' }}>
          <h1 className="fw-bold" style={{ fontSize: '11rem', color: '#3c2f2f', marginLeft: '1rem', lineHeight: '1' }}>Walkora</h1>
        </div>

        <div className="container">
          <div className="collapse mt-3" id="searchCollapse">
            <input
              type="text"
              className="form-control mt-5"
              placeholder="Search by Name, Brand & Category"
              style={{ maxWidth: '400px' }}
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>
        </div>

        <div className="container d-flex flex-column justify-content-center align-items-start text-start" style={{ minHeight: '70vh' }}>
          <h1 className="fw-bold display-2 animate-fade-in-top" style={{ color: 'white' }}>Your Fashion <br /> Your Flex!</h1>
          <p className="text-dark fs-5 mb-4 animate-slide-in-left" style={{ maxWidth: '500px' }}>
            Celebrate elegance and confidence in every step — crafted for
            <span className="ms-2 fw-bold"> LADIES, MEN, and KIDS alike.</span>
          </p>
          <a href="/allproducts" className="btn text-white animate-zoom-in text-decoration-none" style={{
            background: 'linear-gradient(to right, #ff8008, #ffc837)', borderRadius: '50px', padding: '14px 35px', fontSize: '1.4rem', fontWeight: 'bold', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
          }}>SHOP NOW</a>
        </div>
      </div>

      {/* SHOP BY CATEGORY */}
      <div className="container my-5">
        <h3 className="text-center mb-4 fw-bold">Shop by Category</h3>
        <div className="row text-center g-4">
          {categoryProducts.map((item, index) => (
            <div className="col-md-4 col-sm-6" key={index}>
              <Link to="/allproducts" className="text-decoration-none">
                <div className="rounded-circle overflow-hidden mx-auto mb-2 hover-shadow" style={{
                  width: "150px", height: "150px",
                  border: "3px solid black", transition: "transform 0.3s"
                }}>
                  <img src={`data:image/png;base64,${item.product.image}`} alt={item.category} className="w-100 h-100 object-fit-cover" />
                </div>
                <button className="btn btn-sm text-white px-4" style={{ background: "linear-gradient(to right, #ff8008, #ffc837)" }}>
                  {item.category}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* TRENDING COLLECTIONS */}
      <div className="container my-5">
        <h2 className="text-center mb-4 fw-bold">Trending Collections</h2>
        <div className="row g-4">
          {genderProducts.map((item, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="trending-card" style={{
                backgroundImage: `url('data:image/png;base64,${item.product.image}')`
              }}>
                <div className="trending-overlay">
                  <h4 className="fw-bold">{item.gender.toUpperCase()}</h4>
                  <p className="fs-5">Exclusive Collections</p>
                  <a href="/allproducts" className="btn btn-outline-light mt-2 px-4 rounded-pill fw-semibold">SHOP NOW</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
