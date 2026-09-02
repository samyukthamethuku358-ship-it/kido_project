import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/OrderDetails.css";

const API_URL = "http://localhost:3000";

const FALLBACK_IMAGE =
  "https://placehold.co/150x150/f5f5f5/777?text=Toy";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // GET LOGGED-IN USER
  // =========================================

  const getLoggedInUser = () => {
    try {
      const user =
        JSON.parse(localStorage.getItem("user") || "null") ||
        JSON.parse(localStorage.getItem("loggedInUser") || "null") ||
        JSON.parse(localStorage.getItem("currentUser") || "null");

      return user;
    } catch (err) {
      console.error("Error reading logged-in user:", err);
      return null;
    }
  };

  // =========================================
  // FETCH ORDER
  // =========================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        setOrder(null);

        const loggedUser = getLoggedInUser();

        if (!loggedUser) {
          setError("Please login to view your order details.");
          return;
        }

        const response = await fetch(`${API_URL}/orders/${id}`);

        if (!response.ok) {
          throw new Error("Order not found");
        }

        const data = await response.json();

        // =========================================
        // VERIFY ORDER BELONGS TO CURRENT USER
        // =========================================

        if (
          loggedUser.id !== undefined &&
          data.userId !== undefined &&
          String(data.userId) !== String(loggedUser.id)
        ) {
          setError("You are not authorized to view this order.");
          return;
        }

        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);

        setError(
          "Unable to load order details. Please make sure JSON Server is running on port 3000."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // =========================================
  // CANCEL ORDER
  // =========================================

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Cancelled",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      const updatedOrder = await response.json();

      setOrder(updatedOrder);

      window.alert("Order cancelled successfully.");
    } catch (err) {
      console.error("Cancel order error:", err);

      window.alert(
        "Unable to cancel the order. Please try again."
      );
    }
  };

  // =========================================
  // FORMAT PRICE
  // =========================================

  const formatPrice = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN");
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (value) => {
    if (!value) {
      return "Date unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // IMAGE ERROR HANDLER
  // =========================================

  const handleImageError = (event) => {
    if (event.currentTarget.dataset.fallback === "true") {
      return;
    }

    event.currentTarget.dataset.fallback = "true";
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-loading">
          <h2>Loading Order Details...</h2>
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error || !order) {
    return (
      <div className="order-details-page">
        <div className="order-details-container">
          <div className="order-error">
            <div className="order-error-icon">⚠️</div>

            <h2>Order Not Found</h2>

            <p>
              {error || "We couldn't find this order."}
            </p>

            <Link
              to="/orders"
              className="back-orders-btn"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // ORDER STATUS
  // =========================================

  const status = order.status || "Processing";

  const normalizedStatus = String(status).toLowerCase();

  const isCancelled =
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled";

  const isProcessing =
    normalizedStatus === "processing" ||
    normalizedStatus === "pending";

  let statusClass = "completed";

  if (isProcessing) {
    statusClass = "processing";
  } else if (isCancelled) {
    statusClass = "cancelled";
  } else if (normalizedStatus === "delivered") {
    statusClass = "delivered";
  }

  // =========================================
  // ORDER DATE
  // =========================================

  const orderDate =
    order.createdAt ||
    order.date ||
    order.orderDate;

  const formattedDate = formatDate(orderDate);

  // =========================================
  // ORDER ITEMS
  // =========================================

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const totalItems = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 1),
    0
  );

  // =========================================
  // ORDER PRICE
  // =========================================

  const calculatedSubtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
      Number(item.quantity || 1),
    0
  );

  const subtotal =
    order.subtotal !== undefined
      ? Number(order.subtotal)
      : calculatedSubtotal;

  const deliveryCharge =
    order.deliveryCharge !== undefined
      ? Number(order.deliveryCharge)
      : 0;

  const calculatedTotal =
    subtotal + deliveryCharge;

  const total =
    order.total !== undefined
      ? Number(order.total)
      : calculatedTotal;

  // =========================================
  // CUSTOMER INFORMATION
  // =========================================

  const customer = order.customer || {};

  const loggedUser = getLoggedInUser();

  const customerName =
    customer.name ||
    loggedUser?.name ||
    "Customer";

  const customerEmail =
    customer.email ||
    loggedUser?.email ||
    "";

  const customerPhone =
    customer.phone ||
    loggedUser?.phone ||
    "";

  // =========================================
  // SHIPPING ADDRESS
  // =========================================

  const shippingAddress =
    order.shippingAddress || {};

  const address =
    shippingAddress.address ||
    shippingAddress.street ||
    "Address not available";

  const city =
    shippingAddress.city || "";

  const state =
    shippingAddress.state || "";

  const pincode =
    shippingAddress.pincode ||
    shippingAddress.zip ||
    "";

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="order-details-page">
      <div className="order-details-container">

        {/* BACK BUTTON */}

        <Link
          to="/orders"
          className="back-orders-link"
        >
          ← Back to My Orders
        </Link>

        {/* ORDER HEADER */}

        <div className="order-details-header">
          <div>
            <p className="order-label">
              Order ID
            </p>

            <h1>
              #{order.id}
            </h1>
          </div>

          <span
            className={`order-status ${statusClass}`}
          >
            {status}
          </span>
        </div>

        {/* ORDER INFORMATION */}

        <div className="order-info-grid">

          <div className="order-info-box">
            <span>Order Date</span>

            <strong>
              {formattedDate}
            </strong>
          </div>

          <div className="order-info-box">
            <span>Items</span>

            <strong>
              {totalItems}
            </strong>
          </div>

          <div className="order-info-box">
            <span>Total</span>

            <strong>
              ₹{formatPrice(total)}
            </strong>
          </div>

        </div>

        {/* CUSTOMER INFORMATION */}

        {(customerName ||
          customerEmail ||
          customerPhone) && (
            <div className="order-section">

              <h2>
                Customer Information
              </h2>

              <div className="customer-information">

                {customerName && (
                  <div>
                    <span>Name</span>

                    <strong>
                      {customerName}
                    </strong>
                  </div>
                )}

                {customerEmail && (
                  <div>
                    <span>Email</span>

                    <strong>
                      {customerEmail}
                    </strong>
                  </div>
                )}

                {customerPhone && (
                  <div>
                    <span>Phone</span>

                    <strong>
                      {customerPhone}
                    </strong>
                  </div>
                )}

              </div>
            </div>
          )}

        {/* ORDER ITEMS */}

        <div className="order-section">

          <h2>
            Order Items
          </h2>

          <div className="order-items">

            {items.length > 0 ? (
              items.map((item, index) => {
                const quantity =
                  Number(item.quantity || 1);

                const price =
                  Number(item.price || 0);

                const itemTotal =
                  price * quantity;

                return (
                  <div
                    className="order-item"
                    key={
                      item.id ||
                      `${order.id}-${index}`
                    }
                  >

                    {/* IMAGE */}

                    <div className="order-item-image">
                      <img
                        src={
                          item.image ||
                          FALLBACK_IMAGE
                        }
                        alt={
                          item.name ||
                          "Toy"
                        }
                        onError={
                          handleImageError
                        }
                      />
                    </div>

                    {/* DETAILS */}

                    <div className="order-item-details">

                      <h3>
                        {item.name ||
                          "Product"}
                      </h3>

                      <p>
                        Category:{" "}
                        {item.category ||
                          "Kids Products"}
                      </p>

                      <p>
                        Quantity:{" "}
                        {quantity}
                      </p>

                      <p>
                        Price: ₹
                        {formatPrice(price)}
                      </p>

                    </div>

                    {/* ITEM TOTAL */}

                    <div className="order-item-price">
                      ₹
                      {formatPrice(
                        itemTotal
                      )}
                    </div>

                  </div>
                );
              })
            ) : (
              <p>
                No items found for this order.
              </p>
            )}

          </div>
        </div>

        {/* DELIVERY ADDRESS */}

        <div className="order-section">

          <h2>
            Delivery Address
          </h2>

          <div className="delivery-address">

            <div className="address-icon">
              📍
            </div>

            <div>

              <h3>
                {customerName}
              </h3>

              <p>
                {address}
              </p>

              {(city ||
                state ||
                pincode) && (
                  <p>
                    {city}

                    {city && state
                      ? ", "
                      : ""}

                    {state}

                    {pincode
                      ? ` - ${pincode}`
                      : ""}
                  </p>
                )}

              {customerPhone && (
                <p>
                  Phone:{" "}
                  {customerPhone}
                </p>
              )}

            </div>
          </div>
        </div>

        {/* PRICE DETAILS */}

        <div className="order-section">

          <h2>
            Price Details
          </h2>

          <div className="price-details">

            <div className="price-row">
              <span>
                Items Total
              </span>

              <span>
                ₹{formatPrice(subtotal)}
              </span>
            </div>

            <div className="price-row">
              <span>
                Delivery
              </span>

              <span
                className={
                  deliveryCharge === 0
                    ? "free-delivery"
                    : ""
                }
              >
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${formatPrice(
                    deliveryCharge
                  )}`}
              </span>
            </div>

            <div className="price-divider" />

            <div className="price-row total-row">

              <strong>
                Total
              </strong>

              <strong>
                ₹{formatPrice(total)}
              </strong>

            </div>

          </div>
        </div>

        {/* CANCEL ORDER */}

        {isProcessing && (
          <div className="cancel-order-section">

            <div>
              <h3>
                Want to cancel this order?
              </h3>

              <p>
                You can cancel the order
                while it is still being
                processed.
              </p>
            </div>

            <button
              type="button"
              className="cancel-order-btn"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </button>

          </div>
        )}

        {/* CANCELLED MESSAGE */}

        {isCancelled && (
          <div className="cancelled-message">

            <div className="cancelled-icon">
              ✓
            </div>

            <div>
              <h3>
                Order Cancelled
              </h3>

              <p>
                This order has been
                cancelled successfully.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default OrderDetails;