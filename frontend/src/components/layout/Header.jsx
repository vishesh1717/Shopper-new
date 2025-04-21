import React from "react";
import Search from "./Search";
import { useGetMeQuery } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../redux/api/authApi";

const Header = () => {
  const navigate = useNavigate();

  const { isLoading } = useGetMeQuery();
  const [logout] = useLogoutMutation();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const logoutHandler = async () => {
    try {
      await logout(); // wait for logout request
      navigate(0);    // then reload the page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="navbar navbar-expand-md px-3 py-2">
    <div className="container-fluid">
      {/* Brand Logo */}
      <Link className="navbar-brand" to="/">
        <img
          src="/images/shopper_logo_with_bg.png"
          alt="ShopIT Logo"
          width="120"
          height="auto"
        />
      </Link>

      {/* Toggle Button */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Collapsible Content */}
      <div className="collapse navbar-collapse" id="navbarContent">
        {/* Center Search */}
        <div className="mx-auto my-2 my-md-0 w-100 px-2">
          <Search />
        </div>

        {/* Right Side: Cart & User */}
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item me-3">
            <Link to="/cart" className="nav-link d-flex">
              <span id="cart">Cart</span>
              <span id="cart_count" className="badge ms-1">
                {cartItems?.length}
              </span>
            </Link>
          </li>

          {user ? (
            <li className="nav-item dropdown me-3">
              <button
                className="btn dropdown-toggle d-flex align-items-center"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav me-2 mb-0">
                  <img
                    src={
                      user?.avatar?.url || "/images/default_avatar.jpg"
                    }
                    alt="User Avatar"
                    className="rounded-circle"
                    width="30"
                    height="30"
                  />
                </figure>
                <span>{user?.name}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                {user?.role === "admin" && (
                  <li>
                    <Link className="dropdown-item" to="/admin/dashboard">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link className="dropdown-item" to="/me/orders">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/me/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item text-danger"
                    to="/"
                    onClick={logoutHandler}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          ) : (
            !isLoading && (
              <li className="nav-item me-3">
                <Link to="/login" className="btn btn-outline-light">
                  Login
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  </nav>
  );
};

export default Header;
