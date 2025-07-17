import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Allproducts.css";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

const UserAccount = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchUser();
    fetchOrders();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
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
          <h2 className="display-5 fw-bold">My Account</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 mt-3">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                My Account
              </li>
              <li className="breadcrumb-item">
                <Link to="/allproducts" className="text-white text-decoration-none">
                  Products
                </Link>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-fluid mt-4">
        <div className="row">
          {/* Sidebar */}
          <div
            className="col-md-3"
            style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}
          >
            <div className="p-4">
              <h5 className="text-white mb-4 border-bottom pb-2">
                Hello, {user.username}
              </h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <span className="nav-link text-warning fw-bold">My Orders</span>
                </li>
                <li className="nav-item mb-2">
                  <button
                    className="nav-link text-start text-white"
                    onClick={() => navigate("/changepassword")}
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    Change Password
                  </button>
                </li>
                <li className="nav-item mt-4">
                  <button
                    className="nav-link text-start text-danger"
                    onClick={handleLogout}
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Orders Section */}
          <div className="col-md-9 px-4">
            <h3 className="mb-4 border-bottom pb-2 text-dark">My Orders</h3>

            {orders.length === 0 ? (
              <p className="text-muted">No orders found.</p>
            ) : (
              orders.map((order) => (
                <div className="card mb-3 shadow-sm" key={order._id}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span
                        className={`badge ${
                          order.status === "Delivered"
                            ? "bg-success"
                            : order.status === "Cancelled"
                            ? "bg-danger"
                            : "bg-primary"
                        }`}
                      >
                        {order.status}
                      </span>
                      <small className="text-muted">
                        Ordered on: {new Date(order.orderedAt).toLocaleDateString()}
                      </small>
                    </div>

                    {order.products.map((item, idx) => (
                      <div className="d-flex align-items-center mb-3" key={idx}>
                        <img
                          src={`data:image/jpeg;base64,${item.productId.image}`}
                          alt={item.productId.title}
                          width={80}
                          className="img-fluid me-3 rounded"
                        />

                        <div>
                          <h6 className="mb-1">{item.productId.title}</h6>
                          <p className="mb-1">Quantity: {item.quantity}</p>
                          <p className="mb-0 fw-bold">₹{item.productId.price}</p>
                        </div>
                      </div>
                    ))}

                    <hr />
                    <div className="d-flex justify-content-between">
                      <div>
                        <small>
                          Order ID: <strong>{order._id}</strong>
                        </small>
                        <br />
                        <small>Total: ₹{order.totalAmount}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAccount;
