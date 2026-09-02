import { Link, useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const loggedUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("loggedInUser")) ||
    null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");

    navigate("/login");
  };

  if (!loggedUser) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-card profile-login-card">
            <div className="profile-icon">👤</div>

            <h1>Please Login</h1>

            <p>
              You need to login to view your profile.
            </p>

            <Link
              to="/login"
              className="profile-primary-btn"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        {/* PROFILE HEADER */}
        <section className="profile-card profile-header-card">

          <div className="profile-avatar">
            {loggedUser.name
              ? loggedUser.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="profile-main-info">
            <span className="profile-welcome">
              Welcome back
            </span>

            <h1>
              {loggedUser.name || "User"}
            </h1>

            <p>
              {loggedUser.email || "No email available"}
            </p>

            <span className="profile-role">
              {loggedUser.role === "admin"
                ? "Administrator"
                : "Customer"}
            </span>
          </div>

        </section>


        {/* ACCOUNT INFORMATION */}
        <section className="profile-card">

          <div className="profile-section-title">
            <div className="section-icon">
              👤
            </div>

            <div>
              <h2>Account Information</h2>

              <p>
                Your personal account details
              </p>
            </div>
          </div>


          <div className="profile-info-grid">

            <div className="profile-info-item">
              <span className="info-label">
                Full Name
              </span>

              <strong>
                {loggedUser.name || "Not available"}
              </strong>
            </div>


            <div className="profile-info-item">
              <span className="info-label">
                Email Address
              </span>

              <strong>
                {loggedUser.email || "Not available"}
              </strong>
            </div>


            <div className="profile-info-item">
              <span className="info-label">
                Account Type
              </span>

              <strong>
                {loggedUser.role === "admin"
                  ? "Administrator"
                  : "Customer"}
              </strong>
            </div>


            <div className="profile-info-item">
              <span className="info-label">
                User ID
              </span>

              <strong>
                #{loggedUser.id || "N/A"}
              </strong>
            </div>

          </div>

        </section>


        {/* QUICK ACTIONS */}
        <section className="profile-card">

          <div className="profile-section-title">
            <div className="section-icon">
              ⚡
            </div>

            <div>
              <h2>Quick Actions</h2>

              <p>
                Manage your KiddoCart account
              </p>
            </div>
          </div>


          <div className="profile-actions">

            <Link
              to="/orders"
              className="profile-action-card"
            >
              <div className="action-icon">
                📦
              </div>

              <div>
                <h3>My Orders</h3>

                <p>
                  View and track your orders
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>


            <Link
              to="/products"
              className="profile-action-card"
            >
              <div className="action-icon">
                🛍️
              </div>

              <div>
                <h3>Continue Shopping</h3>

                <p>
                  Explore our latest products
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>
            </Link>

          </div>

        </section>


        {/* LOGOUT */}
        <section className="profile-logout-card">

          <div>
            <h3>Ready to leave?</h3>

            <p>
              You can logout from your KiddoCart account.
            </p>
          </div>

          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </section>

      </div>
    </main>
  );
}

export default Profile;