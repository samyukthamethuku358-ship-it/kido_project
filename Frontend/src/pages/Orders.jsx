import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Orders.css";

const API_URL = "http://localhost:3000";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user
      const loggedUser =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("loggedInUser")) ||
        null;

      // If no user is logged in
      if (!loggedUser || loggedUser.id === undefined) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Fetch orders
      const response = await fetch(`${API_URL}/orders`);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid orders data");
      }

      // Show only logged-in user's orders
      const userOrders = data.filter(
        (order) =>
          String(order.userId) === String(loggedUser.id)
      );

      setOrders(userOrders);
    } catch (err) {
      console.error("Error loading orders:", err);

      setError(
        "Unable to load your orders. Please make sure JSON Server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ORDERS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // GET ORDER DATE
  // =====================================================

  const getOrderDate = (order) => {
    const orderDate =
      order.createdAt ||
      order.date ||
      order.orderDate;

    if (!orderDate) {
      return "N/A";
    }

    const date = new Date(orderDate);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // GET TOTAL ITEMS
  // =====================================================

  const getTotalItems = (order) => {
    if (!Array.isArray(order.items)) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total + Number(item.quantity || 1),
      0
    );
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    const numericPrice = Number(price || 0);

    return numericPrice.toLocaleString("en-IN");
  };

  // =====================================================
  // IMAGE ERROR HANDLER
  // =====================================================

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;

    event.currentTarget.src =
      "https://placehold.co/150x150/f5f5f5/777?text=Toy";
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="orders-loading">
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <main className="orders-page">
      <div className="orders-container">

        {/* HEADER */}

        <div className="orders-header">
          <div>
            <p className="orders-label">
              KIDdoCART
            </p>

            <h1>My Orders</h1>

            <p>
              View and track your recent orders
            </p>
          </div>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>
        </div>

        {/* ERROR */}

        {error && (
          <div className="empty-orders">
            <div className="empty-orders-icon">
              ⚠️
            </div>

            <h2>
              Unable to Load Orders
            </h2>

            <p>{error}</p>

            <button
              type="button"
              className="shop-now-button"
              onClick={fetchOrders}
            >
              Try Again
            </button>
          </div>
        )}

        {/* NO ORDERS */}

        {!error && orders.length === 0 && (
          <div className="empty-orders">
            <div className="empty-orders-icon">
              📦
            </div>

            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
              Start shopping to see your orders
              here.
            </p>

            <Link
              to="/products"
              className="shop-now-button"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* ORDERS */}

        {!error && orders.length > 0 && (
          <div className="orders-list">

            {orders
              .slice()
              .sort((a, b) => {
                const dateA = new Date(
                  a.createdAt ||
                    a.date ||
                    a.orderDate ||
                    0
                ).getTime();

                const dateB = new Date(
                  b.createdAt ||
                    b.date ||
                    b.orderDate ||
                    0
                ).getTime();

                return dateB - dateA;
              })
              .map((order) => {

                // =================================================
                // ORDER STATUS
                // =================================================

                const status =
                  order.status || "Processing";

                const normalizedStatus =
                  String(status).toLowerCase();

                let statusClass = "completed";

                if (
                  normalizedStatus === "processing" ||
                  normalizedStatus === "pending"
                ) {
                  statusClass = "processing";
                } else if (
                  normalizedStatus === "cancelled" ||
                  normalizedStatus === "canceled"
                ) {
                  statusClass = "cancelled";
                } else if (
                  normalizedStatus === "delivered" ||
                  normalizedStatus === "completed"
                ) {
                  statusClass = "completed";
                }

                // =================================================
                // ORDER ITEMS
                // =================================================

                const orderItems =
                  Array.isArray(order.items)
                    ? order.items
                    : [];

                return (
                  <div
                    className="order-card"
                    key={order.id}
                  >

                    {/* ORDER HEADER */}

                    <div className="order-card-header">

                      <div>
                        <span className="order-id-label">
                          Order ID
                        </span>

                        <h3>
                          #{order.id}
                        </h3>
                      </div>

                      <span
                        className={`order-status ${statusClass}`}
                      >
                        {status}
                      </span>

                    </div>

                    {/* ORDER INFORMATION */}

                    <div className="order-card-info">

                      <div>
                        <span>
                          Order Date
                        </span>

                        <strong>
                          {getOrderDate(order)}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Items
                        </span>

                        <strong>
                          {getTotalItems(order)}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Total
                        </span>

                        <strong>
                          ₹{formatPrice(order.total)}
                        </strong>
                      </div>

                    </div>

                    {/* ORDER PRODUCTS */}

                    <div className="order-products">

                      {orderItems.length > 0 ? (
                        <>
                          {orderItems
                            .slice(0, 3)
                            .map((item, index) => (
                              <div
                                className="order-product"
                                key={
                                  item.id ||
                                  `${order.id}-${index}`
                                }
                              >

                                <img
                                  src={
                                    item.image ||
                                    "https://placehold.co/150x150/f5f5f5/777?text=Toy"
                                  }
                                  alt={
                                    item.name ||
                                    "Product"
                                  }
                                  onError={
                                    handleImageError
                                  }
                                />

                                <div>
                                  <h4>
                                    {item.name ||
                                      "Product"}
                                  </h4>

                                  <p>
                                    Qty:{" "}
                                    {Number(
                                      item.quantity || 1
                                    )}
                                  </p>
                                </div>

                              </div>
                            ))}

                          {orderItems.length > 3 && (
                            <div className="more-items">
                              +{" "}
                              {orderItems.length - 3}{" "}
                              more
                            </div>
                          )}
                        </>
                      ) : (
                        <p>
                          No items found for this
                          order.
                        </p>
                      )}

                    </div>

                    {/* ORDER FOOTER */}

                    <div className="order-card-footer">

                      <span>
                        Delivered to{" "}
                        {order.shippingAddress?.city ||
                          "your address"}
                      </span>

                      <Link
                        to={`/orders/${order.id}`}
                        className="view-order-button"
                      >
                        View Order →
                      </Link>

                    </div>

                  </div>
                );
              })}

          </div>
        )}

      </div>
    </main>
  );
}

export default Orders;