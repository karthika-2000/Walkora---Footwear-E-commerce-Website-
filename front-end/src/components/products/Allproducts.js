import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../Navbar';
import { Link } from "react-router-dom";
import axios from "axios";

function AllProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    brand: [],
    material: [],
    category: [],
    gender: [],
    price: [],
  });
  const [cartProducts, setCartProducts] = useState({});
const [showGoToCart, setShowGoToCart] = useState(false);


  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";
  const genderQuery = searchParams.get("gender") || "";

  useEffect(() => {
    if (genderQuery.trim()) {
      fetchGenderResults(genderQuery);
    } else if (searchQuery.trim()) {
      fetchSearchResults(searchQuery);
    } else {
      fetchProducts();
    }
  }, [location.search , genderQuery, searchQuery]);

 const fetchProducts = async (page = 1) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/products/all?page=${page}&limit=9`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setProducts(res.data.products || []);
    setTotalPages(res.data.totalPages);
    setCurrentPage(res.data.currentPage);
  } catch (err) {
    console.error("Error fetching products:", err.response?.data || err.message);
  }
};


  const fetchSearchResults = async (query) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/search?q=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching search results:", err.response?.data || err.message);
    }
  };

  const fetchGenderResults = async (gender) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/search?gender=${gender}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching gender results:", err.response?.data || err.message);
    }
  };

 const applyFilter = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/products/filter", {
      ...filters,
      page: 1, // always start from page 1
      limit: 9
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    setProducts(res.data.products || []);
    setTotalPages(res.data.totalPages || 1);  // update total pages
    setCurrentPage(res.data.currentPage || 1); // update current page
  } catch (err) {
    console.error("Error applying filters:", err.response?.data || err.message);
  }
};


  const clearFilter = async () => {
    setFilters({
      brand: [],
      material: [],
      category: [],
      gender: [],
      price: [],
    });
    fetchProducts();
  };

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prev) => {
      const updated = [...prev[filterType]];
      const index = updated.indexOf(value);
      if (index === -1) {
        updated.push(value);
      } else {
        updated.splice(index, 1);
      }
      return { ...prev, [filterType]: updated };
    });
  };

  const handlePriceChange = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      price: [min, max],
    }));
  };

const handleAddToCart = async (productId) => {
  try {
    await axios.post(
      "http://localhost:5000/api/cart/add",
      { productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setCartProducts((prev) => ({
      ...prev,
      [productId]: 1
    }));
    setShowGoToCart(true);

  } catch (err) {
    console.error("Error adding to cart:", err.response?.data || err.message);
    alert("Failed to add product to cart");
  }
};

const handleIncrease = async (productId) => {
  try {
    await axios.post(
      "http://localhost:5000/api/cart/add",
      { productId, quantity: 1 },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setCartProducts((prev) => ({
      ...prev,
      [productId]: prev[productId] + 1
    }));
  } catch (err) {
    console.error("Error increasing quantity:", err);
  }
};

const handleDecrease = async (productId) => {
  if (cartProducts[productId] <= 1) {
    handleRemove(productId);
    return;
  }
  try {
    await axios.post(
      "http://localhost:5000/api/cart/add",
      { productId, quantity: -1 },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setCartProducts((prev) => ({
      ...prev,
      [productId]: prev[productId] - 1
    }));
  } catch (err) {
    console.error("Error decreasing quantity:", err);
  }
};

const handleRemove = async (productId) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/cart/${productId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setCartProducts((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });

    // Hide "Go to Cart" if no items left
    if (Object.keys(cartProducts).length === 1) {
      setShowGoToCart(false);
    }

  } catch (err) {
    console.error("Error removing product:", err);
  }
};



  return (
    <div>
      <Navbar />

      {/* Top Banner */}
      <div className="text-white py-5" style={{
        backgroundImage: "url('/images/orange-sandals-with-flowers-orange-background_653240-61363.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="container">
          <h2 className="display-5 fw-bold">Products</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 mt-3">
              <li className="breadcrumb-item">
                <a href="/" className="text-white text-decoration-none">Home</a>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">Products</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Filter + Products */}
      <div className="container my-5">
        <div className="row">
          
          {/* Sidebar Filters */}
          <div className="col-md-3 filter-sidebar">
            <h4 className="filter-title">Filter:</h4>
            
            {[
              { type: "brand", options: ["Nike", "Adidas", "Puma", "Woodland", "Bata", "Reebok", "Mochi", "H&M", "Skechers", "Crocs", "Paragon"] },
              { type: "material", options: ["Leather", "Canvas", "Mesh", "Rubber", "Synthetic", "Suede", "Denim"] },
              { type: "category", options: ["Men's Casual Shoes", "Men's Formal Shoes","Men's Sports Shoes", "Women's Flats & Sandals", "Women's Heels","Women's Sneakers", "Boys Footwear", "Girls Footwear", "Kids Footwear"] },
              { type: "gender", options: ["men", "women", "kids"] },
            ].map(({ type, options }) => (
              <div className="filter-group" key={type}>
                <div className="filter-group-title">
                  {type.charAt(0).toUpperCase() + type.slice(1)} <span>&#9660;</span>
                </div>
                <ul className="list-unstyled ps-3 pt-2">
                  {options.map((item, idx) => (
                    <li key={idx}>
                      <input
                        type="checkbox"
                        checked={filters[type].includes(item)}
                        onChange={() => handleCheckboxChange(type, item)}
                      />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Price Filter */}
            <div className="filter-group">
              <div className="filter-group-title">Price <span>&#9660;</span></div>
              <ul className="list-unstyled ps-3 pt-2">
                <li>
                  <input
                    type="radio"
                    name="price"
                    checked={filters.price[0] === 0 && filters.price[1] === 1000}
                    onChange={() => handlePriceChange(0, 1000)}
                  />{" "}
                  Under ₹1000
                </li>
                <li>
                  <input
                    type="radio"
                    name="price"
                    checked={filters.price[0] === 1000 && filters.price[1] === 2000}
                    onChange={() => handlePriceChange(1000, 2000)}
                  />{" "}
                  ₹1000 - ₹2000
                </li>
                <li>
                  <input
                    type="radio"
                    name="price"
                    checked={filters.price[0] === 2000 && filters.price[1] === 3000}
                    onChange={() => handlePriceChange(2000, 3000)}
                  />{" "}
                  ₹2000 - ₹3000
                </li>
                <li>
                  <input
                    type="radio"
                    name="price"
                    checked={filters.price[0] === 3000 && filters.price[1] === 10000}
                    onChange={() => handlePriceChange(3000, 10000)}
                  />{" "}
                  Above ₹3000
                </li>
              </ul>
            </div>

            <button
                className="btn btn-outline-dark w-100"
              onClick={applyFilter}
            >
              Apply Filter
            </button>

            <button
              className="btn btn-outline-dark w-100 mt-3"
              onClick={clearFilter}
            >
              Clear Filter
            </button>
          </div>

          {/* Product Grid */}
          <div className="col-md-9">
            <div className="row g-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="card shadow-sm h-100">
                      <img
                        src={`data:image/jpeg;base64,${product.image}`}
                        className="card-img-top img-fluid"
                        alt={product.title}
                        style={{ height: "250px", width: "300px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <div>
                          <h5 className="card-title">{product.title}</h5>
                          <p className="card-text">₹{product.price}</p>
                        </div>
                        <div className="d-flex flex-column gap-2 mt-auto">
                          <Link to={`/viewproduct/${product._id}`} className="btn btn-outline-dark w-100">
                            View Product
                          </Link>
                         {cartProducts[product._id] ? (
  <div className="d-flex justify-content-between align-items-center">
    <button className="btn btn-sm btn-outline-dark" onClick={() => handleDecrease(product._id)}>-</button>
    <span>{cartProducts[product._id]}</span>
    <button className="btn btn-sm btn-outline-dark" onClick={() => handleIncrease(product._id)}>+</button>
    <button className="btn btn-sm btn-danger ms-2" onClick={() => handleRemove(product._id)}>
      <i className="bi bi-trash"></i>
    </button>
  </div>
) : (
  <button
    className="btn w-100 text-white"
    style={{ background: "linear-gradient(to right, #ff8008, #ffc837)" }}
    onClick={() => handleAddToCart(product._id)}
  >
    Add to Cart
  </button>
)}

                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-5">No products available.</div>
              )}
            </div>
          </div>
          
        </div>
      </div>
      {showGoToCart && (
  <button
    className="btn text-white px-4 py-2 fw-semibold"
    style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "linear-gradient(to right, #ff8008, #ffc837)",
      borderRadius: "50px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      zIndex: 1000
    }}
    onClick={() => navigate("/cart")}
  >
    Go to Cart →
  </button>
)}


{totalPages > 1 && (
  <div className="container mb-5">
    <div className="d-flex justify-content-end">
      <ul className="pagination flex-wrap justify-content-end">
        {/* First */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            style={{ backgroundColor: "#ff8008", color: "white" }}
            onClick={() => fetchProducts(1)}
          >
            First
          </button>
        </li>

        {/* Prev */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            style={{ backgroundColor: "#ff8008", color: "white" }}
            onClick={() => fetchProducts(currentPage - 1)}
          >
            Prev
          </button>
        </li>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
            <button
              className="page-link"
              style={{
                backgroundColor: currentPage === i + 1 ? "#ffc837" : "#fff",
                color: currentPage === i + 1 ? "#000" : "#ff8008",
                border: "1px solid #ff8008"
              }}
              onClick={() => fetchProducts(i + 1)}
            >
              {i + 1}
            </button>
          </li>
        ))}

        {/* Next */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            style={{ backgroundColor: "#ff8008", color: "white" }}
            onClick={() => fetchProducts(currentPage + 1)}
          >
            Next
          </button>
        </li>

        {/* Last */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            style={{ backgroundColor: "#ff8008", color: "white" }}
            onClick={() => fetchProducts(totalPages)}
          >
            Last
          </button>
        </li>
      </ul>
    </div>
  </div>
)}


    </div>
  );
}

export default AllProducts;
