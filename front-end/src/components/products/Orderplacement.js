import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Orderplacement = () => {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart", err);
      alert("Failed to load cart. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const products = cart.products.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));

      const totalAmount = cart.products.reduce(
        (total, item) => total + item.productId.price * item.quantity,
        0
      );

     await axios.post(
  'http://localhost:5000/api/orders/place',
  {
    products,
    totalAmount,
    paymentMethod: 'COD',
    address: 'Use address from user profile'
  },
  {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }
);

      alert("Order placed successfully!");
      navigate('/allproducts');
    } catch (err) {
      console.error("Error placing order", err);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="text-white py-5"
        style={{
          backgroundImage: "url('images/orange-sandals-with-flowers-orange-background_653240-61363.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <h2 className="display-5 fw-bold">Checkout</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 mt-3">
              <li className="breadcrumb-item">
                <a href="/" className="text-white text-decoration-none">Products</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/cart" className="text-white text-decoration-none">My Cart</a>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">Place Order</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container my-5 p-4 shadow-lg border-0" style={{ backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/cart" className="btn btn-dark rounded-pill px-4" style={{ background: 'linear-gradient(to right, #ff8008, #ffc837)' }}>
            ← Back to Cart
          </Link>
          <h4 className="fw-bold mb-0">Order Summary</h4>
          <div style={{ width: '100px' }}></div>
        </div>

        {cart?.products?.length > 0 ? (
          <>
            {cart.products.map((item, idx) => (
              <div className="card mb-3 shadow-sm border-0" key={idx}>
                <div className="row g-0 align-items-center p-3">
                  <div className="col-md-2 position-relative">
                   <img src={`data:image/jpeg;base64,${item.productId.image}`} alt={item.productId.title} className="img-fluid" />

                    <span className="badge bg-secondary position-absolute top-0 start-100 translate-middle">{item.quantity}</span>
                  </div>
                  <div className="col-md-10 ps-3">
                    <h5 className="fw-semibold mb-1">{item.productId.title}</h5>
                    <div className="text-muted small">
                      <p className="mb-1">Brand: {item.productId.brand}</p>
                      <p className="mb-1">Category: {item.productId.category}</p>
                    </div>
                    <span className="fs-5 fw-bold text-black">₹{item.productId.price}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Subtotal</h5>
              <h5 className="fw-bold text-warning">₹{cart.products.reduce(
                (total, item) => total + item.productId.price * item.quantity, 0)}</h5>
            </div>

            <button
              className="btn w-100 text-white fw-semibold py-2"
              style={{ background: 'linear-gradient(to right, #ff8008, #ffc837)', borderRadius: '50px' }}
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </>
        ) : (
          <div className="text-center text-muted py-5">Your cart is empty.</div>
        )}
      </div>
    </div>
  );
};

export default Orderplacement;
