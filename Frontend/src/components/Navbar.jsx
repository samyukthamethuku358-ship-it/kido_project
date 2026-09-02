import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const loadData = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      setCart(
        Array.isArray(savedCart)
          ? savedCart
          : []
      );
    } catch (error) {
      console.error("Cart loading error:", error);
      setCart([]);
    }

    try {
      const savedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      setUser(savedUser);
    } catch (error) {
      console.error("User loading error:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener(
      "cartUpdated",
      loadData
    );

    window.addEventListener(
      "userChanged",
      loadData
    );

    window.addEventListener(
      "storage",
      loadData
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadData
      );

      window.removeEventListener(
        "userChanged",
        loadData
      );

      window.removeEventListener(
        "storage",
        loadData
      );
    };
  }, []);

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loggedInUser");

    setUser(null);

    window.dispatchEvent(
      new Event("userChanged")
    );

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-logo"
        >
          KiddoCart
        </Link>

        <div className="navbar-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Categories
          </NavLink>

          <NavLink
            to="/featured-products"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Featured
          </NavLink>

        </div>

        <div className="navbar-actions">

          <Link
            to="/cart"
            className="cart-link"
          >
            🛒
            <span>Cart</span>

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="user-menu">

              <Link
                to="/profile"
                className="profile-link"
              >
                👤 Profile
              </Link>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          ) : (
            <div className="auth-links">

              <Link
                to="/login"
                className="login-btn"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
              >
                Register
              </Link>

            </div>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;