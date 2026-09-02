import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const API_URL = "http://localhost:3000";

function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsResponse, ordersResponse, usersResponse] =
        await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/orders`),
          fetch(`${API_URL}/users`),
        ]);

      const productsData = productsResponse.ok
        ? await productsResponse.json()
        : [];

      const ordersData = ordersResponse.ok
        ? await ordersResponse.json()
        : [];

      const usersData = usersResponse.ok
        ? await usersResponse.json()
        : [];

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : []
      );

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setProducts([]);
      setOrders([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const goToProducts = () => {
    navigate("/admin/products");
  };

  const goToAddProduct = () => {
    navigate("/admin/add-product");
  };

  const goToOrders = () => {
    navigate("/admin/orders");
  };

  const goToUsers = () => {
    navigate("/admin/users");
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Welcome back! Manage your
            KiddoCart store from here.
          </p>
        </div>

      </div>

      {/* STAT CARDS */}

      <div className="dashboard-stats">

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div>
            <p>Total Products</p>

            <h2>
              {products.length}
            </h2>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            🛒
          </div>

          <div>
            <p>Total Orders</p>

            <h2>
              {orders.length}
            </h2>
          </div>

        </div>

        <div className="dashboard-stat-card">

          <div className="stat-icon">
            👥
          </div>

          <div>
            <p>Total Users</p>

            <h2>
              {users.length}
            </h2>
          </div>

        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div className="dashboard-section">

        <h2>Quick Actions</h2>

        <div className="quick-actions">

          <button
            type="button"
            className="dashboard-action-button"
            onClick={goToProducts}
          >
            <span className="action-icon">
              📦
            </span>

            <span>
              <strong>
                View Products
              </strong>

              <small>
                Manage all products
              </small>
            </span>

            <span className="action-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="dashboard-action-button"
            onClick={goToAddProduct}
          >
            <span className="action-icon">
              ➕
            </span>

            <span>
              <strong>
                Add Product
              </strong>

              <small>
                Add a new product
              </small>
            </span>

            <span className="action-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="dashboard-action-button"
            onClick={goToOrders}
          >
            <span className="action-icon">
              🛍️
            </span>

            <span>
              <strong>
                View Orders
              </strong>

              <small>
                Manage customer orders
              </small>
            </span>

            <span className="action-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="dashboard-action-button"
            onClick={goToUsers}
          >
            <span className="action-icon">
              👥
            </span>

            <span>
              <strong>
                View Users
              </strong>

              <small>
                Manage registered users
              </small>
            </span>

            <span className="action-arrow">
              →
            </span>
          </button>

        </div>

      </div>

      {/* RECENT PRODUCTS */}

      <div className="dashboard-section">

        <div className="section-title-row">

          <h2>
            Recent Products
          </h2>

          <button
            type="button"
            className="view-all-button"
            onClick={goToProducts}
          >
            View All
          </button>

        </div>

        {products.length === 0 ? (

          <div className="empty-dashboard">
            <p>
              No products available.
            </p>

            <button
              type="button"
              onClick={goToAddProduct}
              className="dashboard-primary-button"
            >
              Add Product
            </button>
          </div>

        ) : (

          <div className="recent-products-grid">

            {products
              .slice(0, 4)
              .map((product) => (

                <div
                  className="recent-product-card"
                  key={product.id}
                >

                  <div className="recent-product-image">

                    <img
                      src={product.image}
                      alt={
                        product.title ||
                        product.name ||
                        "Product"
                      }
                    />

                  </div>

                  <div className="recent-product-info">

                    <h3>
                      {product.title ||
                        product.name ||
                        "Product"}
                    </h3>

                    <p>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;