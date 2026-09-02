import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(Array.isArray(savedCart) ? savedCart : []);
  };

  /* =========================================
     INCREASE QUANTITY
  ========================================= */

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      String(item.id) === String(id)
        ? {
            ...item,
            quantity: (item.quantity || 1) + 1,
          }
        : item
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  /* =========================================
     DECREASE QUANTITY
  ========================================= */

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              quantity: (item.quantity || 1) - 1,
            }
          : item
      )
      .filter((item) => (item.quantity || 0) > 0);

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  /* =========================================
     REMOVE PRODUCT
  ========================================= */

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => String(item.id) !== String(id)
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  /* =========================================
     CLEAR CART
  ========================================= */

  const clearCart = () => {
    setCart([]);

    localStorage.removeItem("cart");
  };

  /* =========================================
     PRICE
  ========================================= */

  const getPrice = (item) => {
    const price = Number(item.price);

    return Number.isNaN(price) ? 0 : price;
  };

  /* =========================================
     TOTAL
  ========================================= */

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = getPrice(item);
      const quantity = Number(item.quantity) || 1;

      return total + price * quantity;
    }, 0);
  };

  /* =========================================
     CHECKOUT
  ========================================= */

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    navigate("/checkout");
  };

  /* =========================================
     EMPTY CART
  ========================================= */

  if (cart.length === 0) {
    return (
      <div className="cart-page">

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Looks like you haven't added any
            products to your cart yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping-button"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="cart-header">

        <div>
          <h1>
            Shopping Cart
          </h1>

          <p>
            {cart.length}{" "}
            {cart.length === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>

        <button
          type="button"
          className="clear-cart-button"
          onClick={clearCart}
        >
          Clear Cart
        </button>

      </div>

      {/* =====================================
          CART CONTENT
      ====================================== */}

      <div className="cart-container">

        {/* PRODUCTS */}

        <div className="cart-items">

          {cart.map((item) => {

            const price = getPrice(item);

            const quantity =
              Number(item.quantity) || 1;

            const itemTotal =
              price * quantity;

            return (
              <div
                className="cart-item"
                key={item.id}
              >

                {/* IMAGE */}

                <div className="cart-item-image-container">

                  <img
                    src={item.image}
                    alt={
                      item.title ||
                      item.name ||
                      "Product"
                    }
                    className="cart-item-image"
                  />

                </div>

                {/* DETAILS */}

                <div className="cart-item-details">

                  <h2>
                    {item.title ||
                      item.name ||
                      "Product"}
                  </h2>

                  {item.category && (
                    <p className="cart-item-category">
                      {item.category}
                    </p>
                  )}

                  <p className="cart-item-price">
                    ₹
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                {/* QUANTITY */}

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>

                </div>

                {/* TOTAL */}

                <div className="cart-item-total">

                  <strong>
                    ₹
                    {itemTotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                {/* REMOVE */}

                <button
                  type="button"
                  className="remove-cart-item"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                  aria-label="Remove product"
                >
                  ✕
                </button>

              </div>
            );
          })}

        </div>

        {/* ===================================
            SUMMARY
        ==================================== */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {getTotal().toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong className="free-delivery">
              FREE
            </strong>

          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {getTotal().toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <button
            type="button"
            className="checkout-button"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          <Link
            to="/products"
            className="continue-shopping-link"
          >
            ← Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;