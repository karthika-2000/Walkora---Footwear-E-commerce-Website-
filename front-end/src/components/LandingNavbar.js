import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function LandingNavbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-white shadow-sm py-2 position-relative text-dark">
                <div className="container position-relative">
                    <Link className="navbar-brand position-absolute" to="/" style={{ top: '-30px', left: '0' }}>
                        <img
                            src="images/Wlkora_logo.png"
                            alt="logo"
                            style={{
                                width: '90px',
                                height: '90px',
                                objectFit: 'contain',
                            }}
                        />
                    </Link>

                    <button
                        className="navbar-toggler ms-auto"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav align-items-center ms-auto">

                            <li className="nav-item">
                                <NavLink to="/" className="nav-link text-dark fw-semibold">
                                    HOME
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/aboutus" className="nav-link text-dark fw-semibold">
                                    ABOUT US
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/login" className="nav-link text-dark fw-semibold">
                                    LOGIN
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    to="/signup"
                                    className={({ isActive }) =>
                                        'nav-link ' + (isActive ? 'active text-primary fw-bold' : 'text-dark fw-semibold')
                                    }
                                >
                                    SIGNUP
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to="/allproducts" className="nav-link text-dark">
                                    <i className="bi bi-bag"></i>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <a
                                    className="nav-link text-dark"
                                    data-bs-toggle="collapse"
                                    href="#searchCollapse"
                                    role="button"
                                    aria-expanded="false"
                                    aria-controls="searchCollapse"
                                >
                                    <i className="bi bi-search"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default LandingNavbar;
