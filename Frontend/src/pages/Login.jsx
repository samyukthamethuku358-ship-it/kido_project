import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const API_URL = "http://localhost:3000";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(
          formData.email.trim()
        )}&password=${encodeURIComponent(
          formData.password
        )}`
      );

      if (!response.ok) {
        throw new Error("Unable to connect to server");
      }

      const users = await response.json();

      if (!users || users.length === 0) {
        setError("Invalid email or password.");
        return;
      }

      const user = users[0];

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      if (user.role === "admin") {
        localStorage.setItem(
          "isAdmin",
          "true"
        );

        navigate("/admin", {
          replace: true,
        });
      } else {
        localStorage.removeItem("isAdmin");

        navigate("/", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Make sure JSON Server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-card">

          <h1>Welcome Back</h1>

          <p className="login-subtitle">
            Login to your KiddoCart account
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;