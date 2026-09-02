import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-column brand-column">
          <h2>🧸 KiddoCart</h2>
          <p>
            Bringing smiles to little faces with fun, safe and
            educational toys.
          </p>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/orders">Orders</Link>
        </div>

        <div className="footer-column">
          <h3>Customer Service</h3>
          <Link to="/profile">My Account</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </div>

        <div className="footer-column">
          <h3>Contact Us</h3>
          <p>📧 support@kiddocart.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 Hyderabad, India</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} KiddoCart. All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;