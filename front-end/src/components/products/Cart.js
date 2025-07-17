import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const filtered = {
          ...res.data,
          products: res.data.products.filter((p) => p.productId !== null),
        };
        setCart(filtered);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.productId?._id !== productId),
      }));
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCart({ products: [] });
    } catch (err) {
      console.error("Error clearing cart:", err.response?.data || err.message);
      alert("Failed to clear cart");
    }
  };

  const calculateTotal = () => {
    return cart?.products?.reduce((total, item) => {
      if (!item.productId) return total;
      return total + item.productId.price * item.quantity;
    }, 0);
  };

  return (
    <div>
      <Navbar />

      <div
        className="text-white py-5"
        style={{
          backgroundImage:
            "url('images/orange-sandals-with-flowers-orange-background_653240-61363.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <h2 className="display-5 fw-bold">Cart</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 mt-3">
              <li className="breadcrumb-item">
                <a href="/" className="text-white text-decoration-none">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/allproducts" className="text-white text-decoration-none">Products</a>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">My Cart</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">🛒 Your Cart</h3>
          <Link to="/allproducts" className="btn btn-dark rounded-pill px-4">
            ← Back to Products
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : cart?.products?.length > 0 ? (
          <>
            {cart.products.map((item, index) =>
              item.productId ? (
                <div key={item.productId._id || index} className="card cart-card mb-4 shadow-lg border-0">
                  <div className="row g-0 align-items-center p-3">
                    <div className="col-md-2">
                      {item.productId.image ? (
                       <img src={`data:image/jpeg;base64,${item.productId.image}`} alt={item.productId.title} className="img-fluid rounded" />

                      ) : (
                        <div className="text-muted small">No image available</div>
                      )}
                    </div>
                    <div className="col-md-6 px-3">
                      <h5 className="fw-semibold mb-1">{item.productId.title}</h5>
                      <div className="text-muted small">
                        <p className="mb-1">Brand: {item.productId.brand}</p>
                        <p className="mb-0">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      <span className="fs-5 fw-bold text-black">₹{item.productId.price}</span>
                    </div>
                    <div className="col-md-2 text-end">
                      <button
                        className="btn btn-danger btn-sm px-3 rounded-pill"
                        onClick={() => handleRemove(item.productId._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            )}

            <div className="card p-4 shadow-lg border-0 mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold">Subtotal</h5>
                <h5 className="fw-bold text-warning">₹{calculateTotal()}</h5>
              </div>
              <div className="d-flex flex-column gap-2">
                <Link
                  to="/placeorder"
                  className="btn w-100 text-white"
                  style={{ background: "linear-gradient(to right, #ff8008, #ffc837)" }}
                >
                  Proceed to Checkout →
                </Link>
                <button
                  className="btn w-100 text-white"
                  style={{ background: "linear-gradient(to right, #ff8008, #ffc837)" }}
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted py-5">Your cart is empty.</div>
        )}
      </div>
    </div>
  );
};

export default Cart;
