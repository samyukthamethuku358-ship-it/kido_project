import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.css";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">

      <div className="admin-logo">
        <h2>🧸 KiddoCart</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="admin-nav">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>📦</span>
          View Products
        </NavLink>

        <NavLink
          to="/admin/add-product"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>➕</span>
          Add Product
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>🛒</span>
          Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span>👥</span>
          Users
        </NavLink>

      </nav>

    </aside>
  );
}

export default AdminSidebar;