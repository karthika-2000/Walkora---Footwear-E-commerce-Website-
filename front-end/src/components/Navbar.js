import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
  e.preventDefault();

  const searchTerm = search.trim().toLowerCase();

  if (["men", "women", "kids"].includes(searchTerm)) {
    // Gender-specific search
    navigate(`/allproducts?gender=${searchTerm}`);
  } else if (searchTerm) {
    // General search
    navigate(`/allproducts?q=${searchTerm}`);
  } else {
    // If empty, show all products
    navigate('/allproducts');
  }
};


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-light py-2">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/images/Logo.png" alt="Logo" style={{ width: '80px', height: '80px' }} />
        </Link>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link active text-warning" to="/allproducts">Shop</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/aboutus">About</Link></li>
          </ul>
          <form className="d-flex ms-3" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search by Name, Brand & Category or Gender"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-warning" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          <Link to="/userprofile" className="btn btn-warning ms-2"><i className="bi bi-person"></i></Link>
          <Link to="/cart" className="btn btn-warning ms-2"><i className="bi bi-cart"></i></Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
