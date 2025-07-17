import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewProduct() {
  const [product, setProduct] = useState(null);
  const [cartProducts, setCartProducts] = useState({});
  const [showGoToCart, setShowGoToCart] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        alert("Product not found or you are unauthorized");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setCartProducts({ [productId]: 1 });
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
        [productId]: prev[productId] + 1,
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
        [productId]: prev[productId] - 1,
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

      setCartProducts({});
      setShowGoToCart(false);
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  if (!product) {
    return <p className="text-center mt-5">Loading product details...</p>;
  }

  return (
    <div>
      <Navbar />

      <div className="text-white py-5" style={{
        backgroundImage: "url('/images/orange-sandals-with-flowers-orange-background_653240-61363.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="container">
          <h2 className="display-5 fw-bold">Product Description</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 mt-3">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/allproducts" className="text-white text-decoration-none">Products</Link>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                {product.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-6 text-center">
            <img
              src= {`data:image/jpeg;base64,${product.image}`}
              alt={product.title}
              className="img-fluid rounded"
            />
          </div>

          <div className="col-md-6">
            <h2 className="fw-bold">{product.title}</h2>
            <p className="text-muted">{product.description}</p>
            <h4 className="text-danger mb-3">₹{product.price}</h4>

            {cartProducts[product._id] ? (
              <div className="d-flex justify-content-start align-items-center gap-2">
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

            <div className="border mt-4 p-3 rounded bg-light">
              <p><strong>🚚 Free Shipping:</strong> Minimum Purchase of ₹500</p>
              <p><strong>✅ Warranty:</strong> 1 Year Warranty on all products</p>
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
            zIndex: 1000,
          }}
          onClick={() => navigate("/cart")}
        >
          Go to Cart →
        </button>
      )}
    </div>
  );
}

export default ViewProduct;
