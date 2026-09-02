import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Checkout.css";

const API_URL = "http://localhost:3000";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const user =
    JSON.parse(localStorage.getItem("user")) || null;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedCart =
        JSON.parse(localStorage.getItem("cart")) || [];

      if (Array.isArray(savedCart)) {
        setCart(savedCart);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
      setCart([]);
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const deliveryCharge =
    subtotal >= 1000 ? 0 : 50;

  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError(
        "Your cart is empty. Please add a product first."
      );
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    try {
      setLoading(true);

      const order = {
        userId: user?.id || null,

        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },

        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },

        items: cart.map((item) => ({
          id: item.id,
          name: item.name || item.title,
          category: item.category || "",
          price: Number(item.price || 0),
          oldPrice: Number(item.oldPrice || 0),
          rating: Number(item.rating || 0),
          reviews: Number(item.reviews || 0),
          stock: Number(item.stock || 0),
          featured: Boolean(item.featured),
          ageGroup: item.ageGroup || "",
          image: item.image || "",
          description: item.description || "",
          quantity: Number(item.quantity || 1),
        })),

        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        total: total,
        status: "Processing",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to place order"
        );
      }

      const savedOrder = await response.json();

      localStorage.setItem(
        "lastOrder",
        JSON.stringify(savedOrder)
      );

      localStorage.removeItem("cart");

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert(
        "Order placed successfully!"
      );

      navigate("/products");
    } catch (err) {
      console.error(
        "Order error:",
        err
      );

      setError(
        "Unable to place order. Make sure JSON Server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-icon">
            🛒
          </div>

          <h2>Your Cart is Empty</h2>

          <p>
            Please add a product before
            going to checkout.
          </p>

          <Link
            to="/products"
            className="checkout-shop-btn"
          >
            Continue Shopping
          </Link>

          <br />

          <Link
            to="/cart"
            className="back-cart-link"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-header">
          <div>
            <h1>Checkout</h1>
            <p>
              Complete your order details
            </p>
          </div>

          <Link
            to="/cart"
            className="back-cart-link"
          >
            ← Back to Cart
          </Link>
        </div>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <div className="checkout-content">

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >
            <h2>
              Shipping Information
            </h2>

            <div className="form-group">
              <label htmlFor="name">
                Full Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email *
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone Number *
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">
                Address *
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows="4"
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="city">
                  City *
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">
                  State *
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

            </div>

            <div className="form-group">
              <label htmlFor="pincode">
                Pincode *
              </label>

              <input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength="6"
              />
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : `Place Order - ₹${total.toLocaleString(
                    "en-IN"
                  )}`}
            </button>
          </form>

          <div className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="checkout-items">
              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >
                  <img
                    src={
                      item.image ||
                      "/images/placeholder.jpg"
                    }
                    alt={
                      item.name ||
                      item.title ||
                      "Product"
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/placeholder.jpg";
                    }}
                  />

                  <div className="checkout-item-info">
                    <h3>
                      {item.name ||
                        item.title}
                    </h3>

                    <p>
                      Quantity:{" "}
                      {item.quantity || 1}
                    </p>

                    <strong>
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-line">
              <span>Subtotal</span>

              <span>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <div className="summary-line">
              <span>Delivery</span>

              <span>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </span>
            </div>

            <div className="summary-total">
              <span>Total</span>

              <span>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;